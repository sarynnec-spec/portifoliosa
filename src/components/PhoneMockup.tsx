"use client";

import { motion, type MotionValue } from "framer-motion";
import styles from "./PhoneMockup.module.css";

type PhoneMockupProps = {
  src: string;
  alt: string;
  /** Rotação ligada ao scroll — o aparelho gira enquanto atravessa o ecrã. */
  rotateY?: MotionValue<number>;
  rotateX?: MotionValue<number>;
  variant?: "hero" | "thumb";
};

/**
 * Aparelho em 3D só com CSS: corpo, ilha, botões laterais e reflexo.
 * Nada de imagens de moldura — assim mantém-se nítido em qualquer tamanho
 * e o ecrã real ocupa o espaço todo por dentro.
 */
export default function PhoneMockup({
  src,
  alt,
  rotateY,
  rotateX,
  variant = "thumb",
}: PhoneMockupProps) {
  const animated = Boolean(rotateY);

  return (
    <div className={`${styles.stage} ${variant === "hero" ? styles.stageHero : ""}`}>
      <motion.div
        className={styles.device}
        style={animated ? { rotateY, rotateX } : undefined}
        initial={animated ? { opacity: 0, y: 48, scale: 0.94 } : false}
        whileInView={animated ? { opacity: 1, y: 0, scale: 1 } : undefined}
        viewport={{ once: true, margin: "0px 0px -18% 0px" }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={`${styles.button} ${styles.power}`} aria-hidden="true" />
        <span className={`${styles.button} ${styles.volUp}`} aria-hidden="true" />
        <span className={`${styles.button} ${styles.volDown}`} aria-hidden="true" />

        <span className={styles.screen}>
          <img src={src} alt={alt} loading="lazy" />
          <span className={styles.island} aria-hidden="true" />
          <span className={styles.gloss} aria-hidden="true" />
        </span>
      </motion.div>
    </div>
  );
}
