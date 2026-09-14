"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { profile } from "@/content/profile";
import { useIntroDone } from "@/lib/introGate";
import Badge3D from "./Badge3D";
import LocalTime from "./LocalTime";
import styles from "./Hero.module.css";

/** Curva única usada em toda a entrada do hero. */
const EASE = [0.16, 1, 0.3, 1] as const;

function Line({
  text,
  delay,
  variant,
  ready,
}: {
  text: string;
  delay: number;
  variant?: "outline" | "solid";
  /** Segura a entrada enquanto a abertura estiver no ecrã. */
  ready: boolean;
}) {
  return (
    <span className={styles.lineMask}>
      <motion.span
        className={`${styles.line} ${
          variant === "outline" ? styles.lineOutline : variant === "solid" ? styles.lineSolid : ""
        }`.trim()}
        initial={{ y: "108%" }}
        animate={{ y: ready ? "0%" : "108%" }}
        transition={{ duration: 1.25, ease: EASE, delay }}
      >
        {text}
        {variant === "outline" && (
          /* Cópia por cima, com o mesmo contorno em tom claro, revelada só
             dentro de uma faixa que percorre o nome de um lado ao outro. */
          <span className={styles.sweep} aria-hidden="true">
            {text}
          </span>
        )}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();
  const ready = useIntroDone();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section className={styles.hero} id="topo" ref={ref}>
      <motion.div className={styles.media} style={reduced ? undefined : { y: mediaY }}>
        <motion.video
          className={styles.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={profile.portrait}
          initial={{ scale: reduced ? 1 : 1.14, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : { scale: reduced ? 1 : 1.14, opacity: 0 }}
          transition={{ duration: 2.2, ease: EASE }}
        >
          <source src={profile.showreel} type="video/mp4" />
        </motion.video>
        <div className={styles.scrim} />
      </motion.div>

      <motion.div
        className={styles.inner}
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className={styles.top}>
          <motion.p
            className={styles.status}
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          >
            <span className={styles.pulse} aria-hidden="true" />
            {profile.status}
          </motion.p>
          <motion.p
            className={styles.clock}
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.45 }}
          >
            {profile.location} — <LocalTime />
          </motion.p>
        </div>

        <Badge3D />

        <h1 className={styles.name}>
          <Line text={profile.firstName} delay={0.15} variant="solid" ready={ready} />
          <Line text={profile.lastName} delay={0.28} variant="outline" ready={ready} />
          <span className={styles.srOnly}>
            {profile.firstName} {profile.lastName}, {profile.role}
          </span>
        </h1>

        <div className={styles.bottom}>
          <motion.p
            className={styles.role}
            initial={{ opacity: 0, y: 18 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 1, ease: EASE, delay: 0.62 }}
          >
            {profile.role}
          </motion.p>
          <motion.p
            className={styles.availability}
            initial={{ opacity: 0, y: 18 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            transition={{ duration: 1, ease: EASE, delay: 0.72 }}
          >
            {profile.availability}
          </motion.p>
          <motion.a
            href="#trabalho"
            className={styles.scroll}
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          >
            <span>Ver trabalho</span>
            <span className={styles.scrollTrack} aria-hidden="true">
              <span className={styles.scrollDot} />
            </span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
