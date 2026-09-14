"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { about, profile } from "@/content/profile";
import Reveal from "./Reveal";
import styles from "./About.module.css";

/** As duas fotografias que se revezam na moldura. */
const RETRATOS = [
  { src: "/media/me/sarynne.png", alt: "Retrato de Sarynne Ferreira" },
  {
    src: "/media/me/retrato-estudio.jpg",
    alt: "Retrato de estúdio de Sarynne Ferreira, a preto e branco",
  },
];

/** Tempo de cada fotografia no ecrã, em milissegundos. */
const TROCA_MS = 5200;

export default function About() {
  const [qual, setQual] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  /* Revezam-se sozinhas. Uma só imagem parada ao lado do texto não dizia nada
     de novo a quem já tinha lido; duas dão-lhe motivo para voltar a olhar. */
  useEffect(() => {
    const id = window.setInterval(() => setQual((n) => (n + 1) % RETRATOS.length), TROCA_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className={`section ${styles.section}`} id="sobre">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <Reveal as="p" className="eyebrow">
            Sobre
          </Reveal>

          <Reveal as="h2" className={`display ${styles.heading}`} delay={0.06}>
            {about.heading}
          </Reveal>

          {about.paragraphs.map((paragraph, i) => (
            <Reveal as="p" className={styles.paragraph} key={i} delay={0.1 + i * 0.06}>
              {paragraph}
            </Reveal>
          ))}

          <Reveal delay={0.16}>
            <dl className={styles.facts}>
              {about.facts.map((fact) => (
                <div className={styles.fact} key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className={styles.media} ref={ref}>
          <div className={styles.frame}>
            {/*
              A mesma revelação do reel: quatro pontos marcam os cantos de uma
              caixa que morfa de larga-e-baixa para alta, e a fotografia
              abre-se lá dentro. As proporções e a curva são as que estão
              medidas em motion-studio/src/scenes/Revelacao.tsx.
            */}
            <motion.div
              className={styles.revelacao}
              initial={reduced ? false : { width: "118%", height: "36.4%" }}
              whileInView={{
                /* A largura passa do valor final e só depois assenta — o reel
                   tem o mesmo excesso, de 5,4%, antes de estabilizar. */
                width: ["118%", "105.4%", "100%"],
                height: ["36.4%", "92.5%", "100%"],
              }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{
                duration: 0.83,
                times: [0, 0.62, 1],
                /* Smootherstep, a curva do reel — não é a mesma coisa que uma
                   smoothstep, e foi confirmada lá fotograma a fotograma. */
                ease: (t: number) => t * t * t * (t * (t * 6 - 15) + 10),
              }}
            >
              {/* A fotografia mantém o tamanho final enquanto a caixa cresce:
                  é a caixa que a revela, não a foto que se estica. */}
              <motion.div
                className={styles.dentro}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: [0, 0, 1, 1] }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                /* Entra a seco, sem desvanecer, quando a caixa passa os 45% —
                   como no reel, onde nada faz fade. */
                transition={{ duration: 0.83, times: [0, 0.44, 0.45, 1], ease: "linear" }}
              >
                {RETRATOS.map((retrato, i) => (
                  <motion.img
                    key={retrato.src}
                    src={retrato.src}
                    alt={retrato.alt}
                    className={styles.portrait}
                    style={reduced ? undefined : { y: imageY, scale: 1.12 }}
                    animate={{ opacity: qual === i ? 1 : 0 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    loading={i === 0 ? "lazy" : "eager"}
                  />
                ))}
              </motion.div>

              {["cimaEsq", "cimaDir", "baixoEsq", "baixoDir"].map((canto) => (
                <span key={canto} className={`${styles.ponto} ${styles[canto]}`} aria-hidden="true" />
              ))}
            </motion.div>

            {/* Detalhe: um traço laranja a dar a volta ao contorno. */}
            <svg
              className={styles.contorno}
              viewBox="0 0 100 125"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <rect x="0" y="0" width="100" height="125" pathLength={1} />
            </svg>
          </div>
          <p className={styles.caption}>
            <span>{profile.fullName}</span>
            <span>{profile.location}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
