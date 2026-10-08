"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AnimacaoCanto.module.css";

/**
 * A faixa animada no canto da secção Motion.
 *
 * A frase é dela — sai do manifesto do `profile.ts` — e entra no fim de cada
 * volta, no mesmo sítio e no mesmo momento em que o original escrevia o
 * texto que foi retirado. Mudar a frase mexe-se aqui e em mais lado nenhum.
 */
const FRASE = "Da ideia ao código em produção.";

/** Segundos, antes do fim da volta, em que a frase aparece. */
const ANTECIPACAO = 4;

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
      <p className={styles.frase} data-visivel={visivel || undefined}>
        {FRASE}
      </p>
    </div>
  );
}
