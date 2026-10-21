"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";
import styles from "./PulseArco.module.css";

/*
 * Os três movimentos do vídeo de referência (9tv6eg.mp4, 30 fps), lidos na
 * gravação limpa antes de o ficheiro sair dos Downloads:
 *
 *   1. DAR  — f0 a f12 (0 a 0,40 s): os ecrãs chegam um a um e empilham-se
 *             em baralho junto ao fundo, ainda encostados.
 *   2. ABRIR— f12 a f42 (0,40 a 1,40 s): o baralho abre em leque até ao arco.
 *             É aqui que o contador chega a 100.
 *   3. RODAR— f42 em diante: o arco assenta e passa a rodar devagar.
 *
 *   f72 (2,40 s) — o branco dá lugar às nuvens.
 *
 * Mudar um destes números desencontra a contagem do leque, que é a sincronia
 * que ela pediu.
 */
const DAR = 600;
const ABRIR = 1600;
const NUVENS = 2400;
const LEGENDA = 2900;

/**
 * Abertura do leque e quantos cartões a enchem.
 *
 * A referência tem ~14 cartões em ~200°. Aqui os 9 ecrãs do PULSE entram
 * DUAS vezes (18 cartões) e o leque abre 230°, que é o que põe as pontas a
 * apontar para baixo, até junto da barra do fim.
 *
 * ⚠️ Repetir os ecrãs não inventa nada: são os mesmos nove, e a volta do
 * arco é grande de mais para nove caberem sem buracos.
 */
const ABERTURA = 230;
const VOLTAS = 2;

const pulse = projects.find((p) => p.slug === "pulse")!;
const base = pulse.gallery ?? [];
const ecrans = Array.from({ length: VOLTAS }, () => base).flat();

type Fase = "espera" | "dar" | "abrir" | "rodar";

export default function PulseArco() {
  const ref = useRef<HTMLElement | null>(null);
  const [fase, setFase] = useState<Fase>("espera");
  const [conta, setConta] = useState(0);
  const [ceu, setCeu] = useState(false);
  const [legenda, setLegenda] = useState(false);
  /*
   * 🔴 O arranque é um contador de voltas e NÃO a própria `fase`.
   *
   * Com os temporizadores num efeito que dependia de `fase`, a primeira
   * mudança de fase corria a limpeza do efeito e CANCELAVA os temporizadores
   * seguintes: o arco ficava preso em «abrir», o contador congelava a 37% e
   * as nuvens e a legenda nunca chegavam. Medido, não suposto.
   *
   * Sendo um número que sobe a cada nova volta, o efeito corre uma vez por
   * volta e os quatro tempos ficam armados até ao fim dessa volta.
   */
  const [volta, setVolta] = useState(0);
  const relogios = useRef<ReturnType<typeof setTimeout>[]>([]);

  /*
   * Arranca quando a secção entra no ecrã e REFAZ-SE sempre que ela sai e
   * volta — pedido dela.
   *
   * Os dois limiares não são o mesmo de propósito: entra aos 20% de secção
   * visível, mas só se rearma quando ela sai por COMPLETO (rácio 0). Com um
   * limiar só, uma rolagem a tremer junto à fronteira reiniciava a animação
   * vezes sem conta.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFase("rodar");
      setConta(100);
      setCeu(true);
      setLegenda(true);
      return;
    }
    let dentro = false;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!dentro && e.intersectionRatio >= 0.2) {
          dentro = true;
          setVolta((v) => v + 1);
        } else if (dentro && e.intersectionRatio === 0) {
          dentro = false;
          /* Os relógios da volta anterior têm de morrer aqui: fora do ecrã
             continuavam a disparar e deixavam a secção meio montada. */
          relogios.current.forEach(clearTimeout);
          relogios.current = [];
          setFase("espera");
          setConta(0);
          setCeu(false);
          setLegenda(false);
        }
      },
      { threshold: [0, 0.2] },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      relogios.current.forEach(clearTimeout);
    };
  }, []);

  /* Os três movimentos, um a seguir ao outro, nos tempos lidos na referência. */
  useEffect(() => {
    if (volta === 0) return;
    setFase("dar");
    setConta(0);
    setCeu(false);
    setLegenda(false);
    relogios.current = [
      setTimeout(() => setFase("abrir"), DAR),
      setTimeout(() => setFase("rodar"), ABRIR),
      setTimeout(() => setCeu(true), NUVENS),
      setTimeout(() => setLegenda(true), LEGENDA),
    ];
    const meus = relogios.current;
    return () => meus.forEach(clearTimeout);
  }, [volta]);

  /* O contador sobe do princípio do baralho até o leque estar aberto. */
  useEffect(() => {
    if (volta === 0) return;
    const inicio = performance.now();
    let frame = 0;
    const passo = () => {
      const t = Math.min((performance.now() - inicio) / ABRIR, 1);
      setConta(Math.round(t * 100));
      if (t < 1) frame = requestAnimationFrame(passo);
    };
    frame = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(frame);
  }, [volta]);

  const meio = (ecrans.length - 1) / 2;

  return (
    <section className={styles.seccao} ref={ref} data-fase={fase} aria-labelledby="pulse-arco-titulo">
      {/* As nuvens entram depois de a contagem acabar, como na referência. */}
      <div className={styles.ceu} data-ligado={ceu || undefined} aria-hidden="true" />

      <div className={styles.palco}>
        <div className={styles.roda}>
          {ecrans.map((e, i) => (
            <figure
              key={`${e.src}-${i}`}
              className={styles.carta}
              style={
                {
                  "--a": `${-ABERTURA / 2 + (i * ABERTURA) / (ecrans.length - 1)}deg`,
                  /* A DAR, chegam por ordem, um a um, como quem dá cartas. */
                  "--dar": `${i * (DAR / ecrans.length)}ms`,
                  /* A ABRIR, o leque parte do meio para fora. */
                  "--abrir": `${Math.abs(i - meio) * 55}ms`,
                } as React.CSSProperties
              }
            >
              {/* Só a primeira volta é que se anuncia: na segunda os ecrãs
                  repetem-se, e um leitor dizia dezoito nomes para nove ecrãs. */}
              <img
                src={e.src}
                alt={i < base.length ? e.alt : ""}
                aria-hidden={i < base.length ? undefined : true}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>

      <p className={styles.contador} aria-hidden="true">
        {String(conta).padStart(3, "0")}
        <span>%</span>
      </p>

      <div className={`container ${styles.legenda}`} data-entrou={legenda || undefined}>
        <h2 id="pulse-arco-titulo">{pulse.title}</h2>
        <p className={styles.categoria}>{pulse.category}</p>
        <a className={styles.link} href="#trabalho">
          Ver o projeto
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
