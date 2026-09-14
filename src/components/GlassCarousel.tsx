"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ProjectImage } from "@/content/projects";
import PhoneMockup from "./PhoneMockup";
import styles from "./GlassCarousel.module.css";

type GlassCarouselProps = {
  images: ProjectImage[];
  /** Abre a imagem central em grande — reaproveita o lightbox da secção. */
  onOpen: (index: number) => void;
  label: string;
  /**
   * "vidro": a peça vai dentro de um bloco de vidro — para artes de social
   * media. "aparelho": a peça é o ecrã de um telemóvel, sem vidro à volta,
   * porque a moldura do aparelho já é o enquadramento.
   */
  variante?: "vidro" | "aparelho";
};

/** Tempo que cada peça fica ao centro antes de a seguinte tomar o lugar. */
const AUTOPLAY_MS = 2600;
/** Peças visíveis de cada lado da central; as restantes saem de cena. */
const LADOS = 2;
/**
 * Variante "aparelho": as peças assentam numa roda, não numa fila. Cada uma
 * fica a este ângulo da seguinte, virada para fora do eixo — é o que dá a
 * curva para trás em vez de aparelhos lado a lado.
 */
const PASSO_RODA = 40;

/**
 * Carrossel em perspetiva: a peça central fica de frente, as vizinhas recuam
 * rodadas e mais pequenas. Cada peça é um bloco de vidro com a fotografia
 * dentro — a central acende com o anel de cor.
 */
export default function GlassCarousel({
  images,
  onOpen,
  label,
  variante = "vidro",
}: GlassCarouselProps) {
  const aparelho = variante === "aparelho";
  const total = images.length;
  const [ativo, setAtivo] = useState(0);
  const [aCorrer, setACorrer] = useState(true);
  const reduced = useReducedMotion();
  const palcoRef = useRef<HTMLDivElement | null>(null);
  const [emVista, setEmVista] = useState(false);

  const ir = useCallback(
    (passo: number) => setAtivo((i) => (i + passo + total) % total),
    [total],
  );

  /* Só anda enquanto está à vista: fora do ecrã seria trabalho para ninguém. */
  useEffect(() => {
    const node = palcoRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setEmVista(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!aCorrer || !emVista || reduced || total < 2) return;
    const id = window.setInterval(() => ir(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [aCorrer, emVista, reduced, total, ir]);

  const teclas = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      ir(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      ir(1);
    }
  };

  /*
   * Distância à peça central pelo caminho mais curto: com 5 peças, a de
   * índice 4 está a −1 da primeira e não a +4, e o carrossel dá a volta.
   */
  const desvio = (i: number) => {
    const bruto = i - ativo;
    const meio = Math.floor(total / 2);
    if (bruto > meio) return bruto - total;
    if (bruto < -meio) return bruto + total;
    return bruto;
  };

  return (
    <div className={styles.wrap} data-variante={variante}>
      <div
        className={styles.palco}
        ref={palcoRef}
        role="group"
        aria-roledescription="carrossel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={teclas}
        onMouseEnter={() => setACorrer(false)}
        onMouseLeave={() => setACorrer(true)}
        onFocus={() => setACorrer(false)}
        onBlur={() => setACorrer(true)}
      >
        <div className={styles.pista}>
          {images.map((image, i) => {
            const d = desvio(i);
            const fora = Math.abs(d) > LADOS;
            const central = d === 0;

            return (
              <button
                key={image.src}
                type="button"
                className={styles.carta}
                data-central={central || undefined}
                data-desvio={Math.max(-LADOS - 1, Math.min(LADOS + 1, d))}
                style={
                  aparelho
                    ? ({ "--ang": `${d * PASSO_RODA}deg` } as React.CSSProperties)
                    : undefined
                }
                aria-hidden={fora || undefined}
                tabIndex={fora ? -1 : 0}
                aria-label={
                  central ? `Ampliar: ${image.alt}` : `Trazer para a frente: ${image.alt}`
                }
                onClick={() => (central ? onOpen(i) : setAtivo(i))}
              >
                {/* Sem anel de cor nos aparelhos: ali quem destaca a peça da
                    frente é a profundidade de campo, como na referência. */}
                {!aparelho && <span className={styles.anel} aria-hidden="true" />}
                {aparelho ? (
                  <PhoneMockup src={image.src} alt={image.alt} />
                ) : (
                  <span className={styles.vidro}>
                    <img src={image.src} alt={image.alt} loading="lazy" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.barra}>
        <button
          type="button"
          className={styles.seta}
          onClick={() => ir(-1)}
          aria-label="Peça anterior"
        >
          ‹
        </button>

        <p className={styles.legenda} aria-live="polite">
          {images[ativo].caption ?? images[ativo].alt}
        </p>

        <button
          type="button"
          className={styles.seta}
          onClick={() => ir(1)}
          aria-label="Peça seguinte"
        >
          ›
        </button>
      </div>

      <ul className={styles.pontos}>
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              data-ativo={i === ativo || undefined}
              onClick={() => setAtivo(i)}
              aria-label={`Ir para a peça ${i + 1} de ${total}`}
              aria-current={i === ativo || undefined}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
