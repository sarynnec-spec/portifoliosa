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
 * segura até ao 152, que é o que está aqui (152 ÷ 30 fps). Foi escolhido o
 * 152 e não o fim do trecho porque os últimos oito fotogramas já estão a
 * dissolver para a dança seguinte — congelar lá apanhava-o a meio da mistura.
 */
const POSE = 5.067;

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

          {/*
            O bailarino ocupa o branco que sobrava à direita da frase. É
            decoração — daí o `aria-hidden`: a frase é que é o conteúdo.

            Anda sozinho e calado (`autoPlay muted loop playsInline`), e o
            ficheiro não traz sequer faixa de som, por isso não há nada que
            um navegador possa desbloquear por engano.

            É um só ficheiro, não dois: o moonwalk e a segunda dança foram
            montados numa volta única, com as junções dissolvidas, para se
            lerem como uma coisa só. Ver `POSE`, acima, para a paragem.
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
        </div>
      </div>
    </section>
  );
}
