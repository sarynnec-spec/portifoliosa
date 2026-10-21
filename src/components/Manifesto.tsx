"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { manifesto } from "@/content/profile";
import styles from "./Manifesto.module.css";

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <span className={styles.word}>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/**
 * Segundo em que o bailarino está na pose de mão no ar.
 *
 * Medido no ficheiro montado: o giro acaba no fotograma 140 e a pose fica
 * segura até ao 152. Foi escolhido o 152 e não o fim do trecho porque os
 * últimos oito fotogramas já estão a dissolver para a dança seguinte —
 * congelar lá apanhava-o a meio da mistura.
 *
 * 🔴 7,733 e já não 5,067. Ela mandou trocar a ordem das duas danças, e o
 * ficheiro foi RODADO no fotograma 164 (o primeiro limpo da segunda dança):
 * a segunda dança passou para a frente e o moonwalk para trás. Com isso o
 * fotograma 152 de antes é agora o 232 — 152 + 80, que são os fotogramas
 * que passaram do fim para o princípio. 232 ÷ 30 = 7,733.
 *
 * Rodar em vez de recortar e remontar foi de propósito: as duas dissoluções
 * e o fecho da volta ficaram exactamente como estavam.
 */
const POSE = 7.733;

/**
 * Frase-manifesto que "acende" palavra a palavra conforme o scroll avança.
 * O texto vem do perfil profissional do CV.
 */
export default function Manifesto() {
  const ref = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const words = manifesto.split(" ");

  /* Rato em cima: pára e fica na pose. Rato fora: continua dali. */
  const congelar = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = POSE;
  };

  const retomar = () => {
    void videoRef.current?.play().catch(() => {});
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.28"],
  });

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.grelha}>
          {/*
            🔴 O bailarino vem PRIMEIRO no HTML, não por capricho de
            maquetagem mas porque ela o quis à esquerda, antes do texto. É
            decoração e leva `aria-hidden`, por isso vir à frente não muda
            nada para quem ouve a página — a frase continua a ser a primeira
            coisa que um leitor de ecrã lê de facto.
          */}
          <div
            className={styles.palco}
            aria-hidden="true"
            onMouseEnter={congelar}
            onMouseLeave={retomar}
          >
            <video
              ref={videoRef}
              className={styles.danca}
              src="/media/web/manifesto-danca.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>

          <div className={styles.body} ref={ref}>
            <p className={styles.text}>
              {words.map((word, i) => {
                const start = i / words.length;
                const end = (i + 1) / words.length;
                return (
                  <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
                    {word}
                  </Word>
                );
              })}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
