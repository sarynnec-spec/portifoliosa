"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AnimacaoCanto.module.css";

/**
 * A faixa animada no canto da secção Motion.
 *
 * A frase entra no fim de cada volta, no mesmo sítio e no mesmo momento em
 * que o original escrevia o texto que foi retirado — e entra a escrever-se,
 * letra a letra, como ele fazia. Mudar a frase mexe-se aqui e em mais lado
 * nenhum.
 */
const FRASE = "Onde o design encontra a tecnologia.";

/** Segundos, antes do fim da volta, em que a frase começa a escrever-se. */
const ANTECIPACAO = 4;

/** Intervalo entre letras, em segundos. */
const PASSO = 0.042;

export default function AnimacaoCanto() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    /*
     * Lido do próprio vídeo e não de uma constante com a duração: se um dia
     * o ficheiro for trocado por outro mais curto ou mais longo, a frase
     * continua a cair no fim da volta sem ninguém ir lá acertar.
     */
    const olhar = () => {
      const fim = v.duration;
      if (!Number.isFinite(fim)) return;
      setVisivel(v.currentTime >= fim - ANTECIPACAO);
    };

    v.addEventListener("timeupdate", olhar);
    /* No reinício da volta o `timeupdate` pode demorar um instante a chegar,
       e a frase ficava pendurada no arranque da volta seguinte. */
    v.addEventListener("seeked", olhar);
    return () => {
      v.removeEventListener("timeupdate", olhar);
      v.removeEventListener("seeked", olhar);
    };
  }, []);

  return (
    <div className={styles.caixa}>
      <video
        ref={videoRef}
        className={styles.filme}
        src="/media/web/motion-canto.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/*
        Cada letra no seu `<span>`, com o atraso próprio, e não um corte
        progressivo da frase: cortada, a última palavra saltava de linha
        quando passasse a caber, e a frase dançava enquanto se escrevia.
        Assim o texto ocupa desde o início o espaço que vai ocupar, e só a
        tinta é que chega.

        O `aria-label` guarda a frase inteira — sem ele um leitor de ecrã
        anunciava trinta e cinco letras avulsas.
      */}
      {/*
        A portinha.

        Pedido dela: as personagens entram pela esquerda e, como o fundo é
        todo branco, pareciam cortadas pela margem em vez de estarem a
        chegar. Com a porta ali, a mesma imagem passa a ler-se como alguém a
        entrar — e não é um remendo, é o que o olho precisava para perceber
        o que já estava a acontecer.

        Desenhada no mesmo traço da animação: linha escura fina, sem
        preenchimento, cantos vivos.
      */}
      <svg className={styles.porta} viewBox="0 0 40 92" aria-hidden="true" focusable="false">
        <path d="M1 91 V5 Q1 1 5 1 H34 Q38 1 38 5 V91" />
        <path d="M9 91 V13 Q9 10 12 10 H34" />
        <circle cx="14" cy="54" r="1.8" />
      </svg>

      <p className={styles.frase} data-visivel={visivel || undefined} aria-label={FRASE}>
        {[...FRASE].map((letra, i) => (
          <span key={i} aria-hidden="true" style={{ transitionDelay: `${i * PASSO}s` }}>
            {letra === " " ? " " : letra}
          </span>
        ))}
      </p>
    </div>
  );
}
