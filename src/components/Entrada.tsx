"use client";

import { useEffect, useRef } from "react";
import Marquee from "./Marquee";
import { disciplines } from "@/content/profile";
import styles from "./Entrada.module.css";

/**
 * As disciplinas escritas na própria viga de onde os baloiços pendem —
 * é assim na referência que ela mandou.
 *
 * Só as de design, porque foi o que ela pediu para esta entrada. Todas
 * constam da lista `disciplines` do perfil; nada aqui é novo.
 */
const NA_VIGA = ["UX/UI Design", "Identidade Visual", "Motion Design", "Web Design"];

/** Velocidade do rato, em px/ms, a que o baloiço chega ao máximo. */
const RAPIDO = 2.2;
/** Quanto o baloiço acelera, no máximo. */
const MAX = 3.6;
/** Quão depressa volta ao ritmo normal depois de o rato parar. */
const TRAVAO = 0.92;

export default function Entrada() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const palcoRef = useRef<HTMLDivElement | null>(null);

  /*
   * O baloiço anda conforme a velocidade a que o rato passa por ele.
   *
   * Mexe-se no `playbackRate` e não no `currentTime`: saltar no tempo obriga
   * o descodificador a procurar o fotograma-chave mais próximo e a imagem
   * engasga; mudar o ritmo é contínuo e nunca falha um fotograma.
   *
   * O alvo cai sozinho para 1 quando o rato pára — senão ficava acelerado
   * para sempre depois de uma passagem rápida.
   */
  useEffect(() => {
    const palco = palcoRef.current;
    const v = videoRef.current;
    if (!palco || !v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alvo = 1;
    let atual = 1;
    let ultimoX: number | null = null;
    let ultimoT = 0;
    let frame = 0;

    const mover = (e: PointerEvent) => {
      const agora = performance.now();
      if (ultimoX !== null) {
        const dt = agora - ultimoT;
        if (dt > 0 && dt < 200) {
          const vel = Math.abs(e.clientX - ultimoX) / dt;
          alvo = Math.max(alvo, 1 + Math.min(vel / RAPIDO, 1) * (MAX - 1));
        }
      }
      ultimoX = e.clientX;
      ultimoT = agora;
    };

    const sair = () => {
      ultimoX = null;
    };

    const passo = () => {
      alvo = 1 + (alvo - 1) * TRAVAO;
      atual += (alvo - atual) * 0.18;
      /* Fora de [0.0625, 16] os browsers ignoram ou atiram. */
      const r = Math.min(Math.max(atual, 0.25), 8);
      if (Math.abs(v.playbackRate - r) > 0.01) v.playbackRate = r;
      frame = requestAnimationFrame(passo);
    };
    frame = requestAnimationFrame(passo);

    palco.addEventListener("pointermove", mover);
    palco.addEventListener("pointerleave", sair);
    return () => {
      cancelAnimationFrame(frame);
      palco.removeEventListener("pointermove", mover);
      palco.removeEventListener("pointerleave", sair);
    };
  }, []);

  return (
    <section className={styles.entrada}>
      {/*
        A banda é o vídeo: a viga, as letras a baloiçar e o laranja por baixo.

        O fundo do ficheiro acaba exactamente em RGB(233,112,3) — o mesmo
        laranja que a secção tem em CSS — e o topo dele é MAIS ESCURO, por
        causa da vinheta do estúdio. Por isso a folga de cima não é chapada:
        é um degradê horizontal copiado da primeira linha do vídeo.
      */}
      <div className={styles.banda}>
        {/* O palco é o contexto de posicionamento da viga: tem de ser o vídeo
            e não a banda, senão a folga do topo entra na conta das percentagens. */}
        <div className={styles.palco} ref={palcoRef}>
          <video
            ref={videoRef}
            className={styles.filme}
            src="/media/web/entrada-letras.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <p className={styles.viga}>
            {NA_VIGA.map((d, i) => (
              <span key={d}>
                {d}
                {i < NA_VIGA.length - 1 && <i className={styles.losango} aria-hidden="true" />}
              </span>
            ))}
          </p>
          {/*
            ⚠️ Não existe classe `sr-only` neste projeto — pu-la e o título
            apareceu em letras brancas por cima do laranja. Fica escondido como
            a Marquee já o faz, por estilo inline.
          */}
          <h1 style={{ position: "absolute", left: "-9999px" }}>
            Sarynne Ferreira — portfólio de design
          </h1>
        </div>
      </div>

      <div className={`container ${styles.corpo}`}>
        {/* A frase que ela pediu, em branco sobre o laranja, por baixo do baloiço. */}
        <blockquote className={styles.citacao}>
          <p>&ldquo;Good design is as little design as possible.&rdquo;</p>
          <cite>— Dieter Rams</cite>
        </blockquote>

        <p className={styles.frase}>Onde o design encontra a tecnologia.</p>

        <p className={styles.sub}>
          Sou a Sarynne. Trabalho identidade visual, interfaces e motion graphics — e
          construo em código o que desenho.
        </p>

        <div className={styles.botoes}>
          <a className={styles.primario} href="#trabalho">
            Ver o trabalho
            <span aria-hidden="true">→</span>
          </a>
          <a className={styles.secundario} href="#contacto">
            Entrar em contacto
          </a>
        </div>
      </div>

      {/*
        A mesma faixa que já existe no site, não uma cópia dela.

        Na referência esta barra é PRETA, e aqui tinha de o ser também: a
        Marquee pinta-se com `--accent` (#c2481f), que ao lado deste laranja
        ficava laranja sobre laranja. Em vez de lhe mexer, a secção troca a
        variável — o componente fica igual para quem o usa noutro sítio.
      */}
      <div className={styles.faixa}>
        <Marquee items={disciplines} />
      </div>
    </section>
  );
}
