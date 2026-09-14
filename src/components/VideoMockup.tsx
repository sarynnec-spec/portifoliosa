"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import styles from "./VideoMockup.module.css";

type VideoMockupProps = {
  src: string;
  poster: string;
  alt: string;
  rotateY?: MotionValue<number>;
  rotateX?: MotionValue<number>;
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Reel vertical dentro de um aparelho, a rodar com o scroll.
 *
 * Só começa a tocar quando entra em vista — um vídeo a correr fora do ecrã
 * gasta bateria e largura de banda sem ninguém o ver. Arranca sem som porque
 * os browsers bloqueiam autoplay com áudio; o botão liga o som.
 */
export default function VideoMockup({ src, poster, alt, rotateY, rotateX }: VideoMockupProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const [comSom, setComSom] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    const v = video.current;
    if (!node || !v) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const alternarSom = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setComSom(!v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <div className={styles.stage} ref={ref}>
      <motion.div
        className={styles.device}
        style={rotateY && !reduced ? { rotateY, rotateX } : undefined}
        initial={reduced ? false : { opacity: 0, y: 46, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -18% 0px" }}
        transition={{ duration: 1.15, ease: EASE }}
      >
        <span className={styles.island} aria-hidden="true" />
        <span className={styles.screen}>
          <video
            ref={video}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={alt}
          />
          <span className={styles.glare} aria-hidden="true" />
        </span>
      </motion.div>

      <button type="button" className={styles.som} onClick={alternarSom}>
        {comSom ? "Desligar som" : "Ouvir com som"}
        <span aria-hidden="true">{comSom ? "◼" : "▶"}</span>
      </button>
    </div>
  );
}
