"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { pieces, pieceCount } from "@/content/posts";
import Reveal from "./Reveal";
import styles from "./PostsTunnel.module.css";

/* three.js pesa ~140 kB: só entra no bundle quando a secção se aproxima. */
const GalleryTunnel = dynamic(() => import("@/components/vendor/GalleryTunnel"), {
  ssr: false,
});

/**
 * Névoa mais densa em ecrãs grandes, onde o túnel ocupa mais área.
 * (A prop `tunnelSize` do pacote original é ignorada pelo componente — não a passamos.)
 */
function useTunnelFade() {
  const [fade, setFade] = useState(88);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setFade(width < 768 ? 88 : width < 1280 ? 94 : 98);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return fade;
}

export default function PostsTunnel() {
  const reduced = useReducedMotion();
  const fade = useTunnelFade();
  const bandRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  /* Só instancia o WebGL quando a faixa está quase a entrar no ecrã. */
  useEffect(() => {
    const node = bandRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`section ${styles.section}`} id="posts">
      <div className={`container ${styles.head}`}>
        <Reveal as="p" className="eyebrow">
          Social & conteúdo
        </Reveal>
        <Reveal as="h2" className={`display ${styles.title}`} delay={0.06}>
          Peças que <em>circulam</em> todos os dias
        </Reveal>
        <Reveal as="p" className={`lede ${styles.lede}`} delay={0.1}>
          {pieceCount} artes para redes sociais — anúncios, promoções e conteúdo criados para
          marcas de restauração, serviços e tecnologia.
        </Reveal>
      </div>

      <Reveal className={styles.band} delay={0.14}>
        <div className={styles.canvas} ref={bandRef}>
          {active && (
            <GalleryTunnel
              images={pieces.map((piece) => ({ src: piece.src, alt: piece.alt }))}
              background="#ffffff"
              lineColor="#d4d4d4"
              lineOpacity={55}
              /* Paleta do site nas lajes sem imagem: a cor saturada fica só nos posts. */
              colors={["#c2481f", "#14130f", "#e8e8e8", "#8f5236", "#f2f2f2", "#6f6a5f"]}
              grid={4}
              fade={fade}
              speed={reduced ? 0 : 8}
              boost={reduced ? 0 : 28}
              label={false}
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>

        <p className={styles.hint} aria-hidden="true">
          Mantém premido para acelerar
        </p>

        {/* O canvas não é legível por leitores de ecrã: a lista real fica aqui. */}
        <ul className={styles.srOnly}>
          {pieces.map((piece) => (
            <li key={piece.src}>{piece.alt}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
