"use client";

import { useState } from "react";

/**
 * Página de diagnóstico do som — não faz parte do site, serve para saber
 * porque é que um telemóvel não toca.
 *
 * A ideia: o telemóvel mede-se a si próprio e mostra o resultado no ecrã.
 * Toca um apito bem audível e escuta a própria saída com um analisador. Se o
 * pico medido for alto e mesmo assim não se ouvir nada, o problema está no
 * aparelho (interruptor de silêncio, volume, auscultadores) e não no código.
 */

type Linha = { rotulo: string; valor: string };

export default function DiagnosticoSom() {
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [aCorrer, setACorrer] = useState(false);

  const testar = async () => {
    setACorrer(true);
    const registo: Linha[] = [];
    const anota = (rotulo: string, valor: unknown) =>
      registo.push({ rotulo, valor: String(valor) });

    anota("Navegador", navigator.userAgent);

    const Motor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!Motor) {
      anota("AudioContext", "NÃO EXISTE neste browser");
      setLinhas(registo);
      setACorrer(false);
      return;
    }

    anota("AudioContext", window.AudioContext ? "padrão" : "webkit (antigo)");

    const ctx = new Motor();
    anota("Estado ao criar", ctx.state);
    anota("Frequência", `${ctx.sampleRate} Hz`);

    /* Desbloqueio do iOS, dentro do toque e sem esperar por promessas. */
    try {
      const mudo = ctx.createBufferSource();
      mudo.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      mudo.connect(ctx.destination);
      mudo.start(0);
      anota("Desbloqueio", "feito");
    } catch (e) {
      anota("Desbloqueio", `falhou: ${e}`);
    }

    try {
      await ctx.resume();
      anota("Depois do resume", ctx.state);
    } catch (e) {
      anota("Depois do resume", `erro: ${e}`);
    }

    const relogioAntes = ctx.currentTime;

    /* Analisador à saída, para medir o que sai mesmo. */
    const analisador = ctx.createAnalyser();
    analisador.fftSize = 2048;
    const saida = ctx.createGain();
    saida.gain.value = 0.6;
    saida.connect(analisador);
    analisador.connect(ctx.destination);

    /* Apito de um segundo, bem alto e bem audível — não é subtil de propósito. */
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const t = ctx.currentTime + 0.05;
    osc.type = "sine";
    osc.frequency.setValueAtTime(660, t);
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(1, t + 0.02);
    env.gain.setValueAtTime(1, t + 0.9);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 1);
    osc.connect(env).connect(saida);
    osc.start(t);
    osc.stop(t + 1.1);

    const buf = new Float32Array(2048);
    let pico = 0;
    const inicio = Date.now();
    while (Date.now() - inicio < 1400) {
      analisador.getFloatTimeDomainData(buf);
      for (let i = 0; i < buf.length; i += 1) {
        const v = Math.abs(buf[i]);
        if (v > pico) pico = v;
      }
      await new Promise((r) => setTimeout(r, 30));
    }

    const andou = ctx.currentTime - relogioAntes;
    anota("Relógio andou", `${andou.toFixed(2)} s ${andou > 0.5 ? "(bem)" : "(PARADO — problema)"}`);
    anota("Estado no fim", ctx.state);
    anota(
      "Nível medido",
      pico > 0.01
        ? `${pico.toFixed(3)} — O SOM SAIU. Se não ouviu, é o aparelho.`
        : `${pico.toFixed(3)} — NÃO SAIU SOM. É o browser.`,
    );

    setLinhas(registo);
    setACorrer(false);
    window.setTimeout(() => void ctx.close(), 400);
  };

  return (
    <main
      style={{
        minHeight: "100dvh",
        padding: "2rem 1.25rem",
        fontFamily: "ui-monospace, monospace",
        fontSize: "0.9rem",
        lineHeight: 1.5,
        background: "#fff",
        color: "#14130f",
      }}
    >
      <h1 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>Teste de som</h1>
      <p style={{ color: "#6f6a5f", marginBottom: "1.5rem" }}>
        Carregue no botão. Deve ouvir um apito de um segundo. Depois mande-me o que aparecer
        aqui em baixo.
      </p>

      <button
        type="button"
        onClick={testar}
        disabled={aCorrer}
        style={{
          width: "100%",
          padding: "1.1rem",
          fontSize: "1.1rem",
          fontFamily: "inherit",
          color: "#fff",
          background: aCorrer ? "#6f6a5f" : "#14130f",
          border: 0,
          cursor: "pointer",
        }}
      >
        {aCorrer ? "A testar…" : "Tocar apito de teste"}
      </button>

      {linhas.length > 0 && (
        <dl style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
          {linhas.map((linha) => (
            <div key={linha.rotulo} style={{ borderTop: "1px solid #ddd", paddingTop: "0.6rem" }}>
              <dt style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: "#918b7e" }}>
                {linha.rotulo.toUpperCase()}
              </dt>
              <dd style={{ margin: 0, wordBreak: "break-word" }}>{linha.valor}</dd>
            </div>
          ))}
        </dl>
      )}
    </main>
  );
}
