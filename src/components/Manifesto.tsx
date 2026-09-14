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
 * Frase-manifesto que "acende" palavra a palavra conforme o scroll avança.
 * O texto vem do perfil profissional do CV.
 */
export default function Manifesto() {
  const ref = useRef<HTMLDivElement | null>(null);
  const words = manifesto.split(" ");

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.28"],
  });

  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
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
    </section>
  );
}
