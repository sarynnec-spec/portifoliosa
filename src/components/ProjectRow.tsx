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
  /*
   * Uma só coluna — peça ampla em cima, texto centrado por baixo — apenas
   * quando não há destaques: aí o texto é curto demais para encher a coluna ao
   * lado de uma peça alta (no LODÊ sobravam 1485 px de vazio, medido a 1440).
   *
   * Os projetos com vídeo mantêm as duas colunas, por decisão dela: a peça fica
   * ao lado da descrição e a ficha técnica passa por baixo, em `.specs`.
   */
  const solo = !project.highlights?.length;
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

      {/*
       * Projetos sem destaques têm pouco texto, e ao lado de uma captura de
       * página inteira sobrava um vazio enorme na coluna da esquerda. Nesses,
       * a peça passa a ocupar a largura toda e o texto vai para baixo, centrado.
       */}
      <div className={solo ? `${styles.body} ${styles.bodySolo}` : styles.body}>
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
              temSom={project.temSom}
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
          ) : isSite && project.video ? (
            /*
             * Vídeo horizontal dentro da moldura de janela. O aparelho do
             * VideoMockup é um telemóvel — só serve 9:16 e 4:5 — e esticá-lo
             * para paisagem obrigava a cortar. Toca sozinho, em silêncio e em
             * ciclo, como uma demonstração: não tem faixa de áudio.
             */
            <figure className={styles.window}>
              <figcaption className={styles.chrome}>
                <span className={styles.dots} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.chromeLabel}>{project.title}</span>
                <span className={styles.livePill}>demonstração</span>
              </figcaption>
              <video
                className={styles.filme}
                src={project.video}
                poster={project.cover.src}
                style={project.coverAspect ? { aspectRatio: project.coverAspect } : undefined}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={project.cover.alt}
              />
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

        </div>
      </div>

      {/*
       * Ficha técnica por baixo das duas colunas, em largura total e centrada.
       * Dentro da coluna de texto, as etiquetas empurravam-na para baixo do
       * vídeo e as duas deixavam de estar lado a lado.
       */}
      {(project.stack || project.link || project.repo) && (
        <div className={styles.specs}>
          {project.stack && (
            <Reveal as="ul" className={styles.stack} delay={0.14}>
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Reveal>
          )}

          {(project.link || project.repo) && (
            <Reveal delay={0.18}>
              <div className={styles.links}>
                {project.link && (
                  <a
                    className={styles.link}
                    href={project.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.link.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
                {project.repo && (
                  <a
                    className={styles.link}
                    href={project.repo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* Octocat — o emoji 🐙 é um polvo, não a marca do GitHub. */}
                    <svg
                      className={styles.octocat}
                      viewBox="0 0 16 16"
                      width="1.1em"
                      height="1.1em"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                    </svg>
                    {project.repo.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </div>
      )}

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
