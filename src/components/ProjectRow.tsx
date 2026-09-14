"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Project, ProjectImage } from "@/content/projects";
import GlassCarousel from "./GlassCarousel";
import PhoneMockup from "./PhoneMockup";
import VideoMockup from "./VideoMockup";
import Reveal from "./Reveal";
import styles from "./Work.module.css";

type ProjectRowProps = {
  project: Project;
  onOpen: (images: ProjectImage[], index: number) => void;
};

export default function ProjectRow({ project, onOpen }: ProjectRowProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4.5%", "4.5%"]);

  /* App: o aparelho gira enquanto atravessa o ecrã, de frente a três quartos. */
  const deviceRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [26, -2, -22]);
  const deviceRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [9, 1, -7]);

  const images = project.gallery ?? [project.cover];
  /*
   * Carrossel: a peça central já mostra a capa em grande, por isso a moldura
   * fixa sai e o texto passa para baixo da animação.
   */
  const carrossel =
    project.galleryMode === "carousel" && !!project.gallery && project.gallery.length > 1;
  /* Ecrãs de telemóvel entram inteiros (contain) — deslocá-los cortaria o mockup. */
  const parallax = !reduced && project.coverRatio !== "phone";

  /* Projetos de site: capturas de página inteira, muito altas (até 1:7.4). */
  const isSite = project.coverRatio === "page";
  const isPhone = project.coverRatio === "phone";
  const isVideo = project.coverRatio === "video";
  const liveHost = project.live ? new URL(project.live).host : null;
  const windowRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  /*
   * Sem rato não há hover: em ecrãs tácteis a página desliza sozinha quando a
   * janela entra em vista, para o site se ver na mesma.
   */
  useEffect(() => {
    const node = windowRef.current;
    if (!node || !isSite) return;
    if (window.matchMedia("(hover: hover)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -25% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isSite]);

  return (
    <article
      className={styles.project}
      ref={ref}
      data-ratio={project.coverRatio}
      data-featured={project.featured || undefined}
      data-galeria={carrossel ? "carrossel" : undefined}
    >
      <Reveal className={styles.header}>
        <span className={styles.index}>{project.index}</span>
        {project.logo ? (
          <div className={styles.titleLine}>
            <img
              className={styles.brandLogo}
              src={project.logo.src}
              alt={project.logo.alt}
              loading="lazy"
            />
            <h3 className={styles.title}>{project.title}</h3>
          </div>
        ) : (
          <h3 className={styles.title}>{project.title}</h3>
        )}
        <p className={styles.category}>{project.category}</p>
      </Reveal>

      <div className={styles.body}>
        <Reveal className={styles.mediaCol}>
          {carrossel ? (
            <GlassCarousel
              images={project.gallery!}
              label={`Peças de ${project.title}`}
              variante={isPhone ? "aparelho" : "vidro"}
              onOpen={(i) => onOpen(project.gallery!, i)}
            />
          ) : isVideo && project.video ? (
            <VideoMockup
              src={project.video}
              poster={project.cover.src}
              alt={project.cover.alt}
              rotateY={reduced ? undefined : deviceRotateY}
              rotateX={reduced ? undefined : deviceRotateX}
            />
          ) : project.live ? (
            /*
             * Site ainda em evolução: em vez de uma captura que envelhece, mostra
             * o site publicado dentro de um iframe — muda sozinho a cada deploy.
             * Sem interação (pointer-events: none) para o scroll da página nunca
             * ficar preso dentro da moldura; o botão abre o site a sério.
             */
            <figure className={styles.window}>
              <figcaption className={styles.chrome}>
                <span className={styles.dots} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.chromeLabel}>{liveHost}</span>
                <span className={styles.livePill}>ao vivo</span>
              </figcaption>
              <div
                className={styles.liveFrame}
                style={{ backgroundImage: `url(${project.cover.src})` }}
              >
                <iframe
                  src={project.live}
                  title={`Pré-visualização ao vivo do site ${project.title}`}
                  loading="lazy"
                  tabIndex={-1}
                />
              </div>
            </figure>
          ) : isSite ? (
            /* Sites: moldura de janela e a página a correr de cima até ao fim. */
            <figure className={styles.window} ref={windowRef} data-inview={inView || undefined}>
              <figcaption className={styles.chrome}>
                <span className={styles.dots} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.chromeLabel}>{project.title}</span>
              </figcaption>
              <button
                type="button"
                className={styles.shot}
                style={project.coverAspect ? { aspectRatio: project.coverAspect } : undefined}
                onClick={() => onOpen(images, 0)}
                aria-label={`Ver a página completa de ${project.title}`}
              >
                <img src={project.cover.src} alt={project.cover.alt} loading="lazy" />
                <span className={styles.zoom}>Ver página completa</span>
              </button>
            </figure>
          ) : (
            <button
              type="button"
              className={isPhone ? styles.coverPhone : styles.cover}
              onClick={() => onOpen(images, 0)}
              aria-label={`Ampliar imagens do projeto ${project.title}`}
            >
              {isPhone ? (
                <PhoneMockup
                  src={project.cover.src}
                  alt={project.cover.alt}
                  rotateY={reduced ? undefined : deviceRotateY}
                  rotateX={reduced ? undefined : deviceRotateX}
                  variant="hero"
                />
              ) : (
                <motion.img
                  src={project.cover.src}
                  alt={project.cover.alt}
                  className={styles.coverImage}
                  style={parallax ? { y } : undefined}
                  loading="lazy"
                />
              )}
              <span className={styles.zoom}>Ampliar</span>
            </button>
          )}
        </Reveal>

        <div className={styles.infoCol}>
          <Reveal as="p" className={styles.description} delay={0.06}>
            {project.description}
          </Reveal>

          {project.highlights && (
            <Reveal as="ul" className={styles.highlights} delay={0.1}>
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Reveal>
          )}

          {project.stack && (
            <Reveal as="ul" className={styles.stack} delay={0.14}>
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Reveal>
          )}

          {project.link && (
            <Reveal delay={0.18}>
              <a
                className={styles.link}
                href={project.link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.link.label}
                <span aria-hidden="true">↗</span>
              </a>
            </Reveal>
          )}
        </div>
      </div>

      {project.gallery && project.gallery.length > 1 && !carrossel && (
        <Reveal className={styles.galleryWrap} delay={0.06}>
          <ul className={styles.gallery}>
            {project.gallery.map((image, i) => (
              <li key={image.src}>
                <button
                  type="button"
                  className={isPhone ? styles.thumbPhone : styles.thumb}
                  onClick={() => onOpen(project.gallery!, i)}
                  aria-label={`Ampliar: ${image.alt}`}
                >
                  {isPhone ? (
                    <PhoneMockup src={image.src} alt={image.alt} />
                  ) : (
                    <img src={image.src} alt={image.alt} loading="lazy" />
                  )}
                </button>
                {image.caption && <p className={styles.thumbCaption}>{image.caption}</p>}
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </article>
  );
}
