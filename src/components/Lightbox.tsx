"use client";

import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectImage } from "@/content/projects";
import styles from "./Lightbox.module.css";

type LightboxProps = {
  images: ProjectImage[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export default function Lightbox({ images, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null;

  const step = useCallback(
    (delta: number) => {
      if (index === null || !images.length) return;
      onIndexChange((index + delta + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, step]);

  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
        >
          <button type="button" className={styles.close} aria-label="Fechar">
            <span />
            <span />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className={`${styles.nav} ${styles.prev}`}
                aria-label="Imagem anterior"
                onClick={(event) => {
                  event.stopPropagation();
                  step(-1);
                }}
              >
                ←
              </button>
              <button
                type="button"
                className={`${styles.nav} ${styles.next}`}
                aria-label="Imagem seguinte"
                onClick={(event) => {
                  event.stopPropagation();
                  step(1);
                }}
              >
                →
              </button>
            </>
          )}

          <motion.figure
            className={styles.figure}
            key={current.src}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <img src={current.src} alt={current.alt} className={styles.image} />
            <figcaption className={styles.caption}>
              <span>{current.caption ?? current.alt}</span>
              {images.length > 1 && (
                <span className={styles.counter}>
                  {String(index! + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                </span>
              )}
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
