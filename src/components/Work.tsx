"use client";

import { useState } from "react";
import { projects, type ProjectImage } from "@/content/projects";
import ProjectRow from "./ProjectRow";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";
import styles from "./Work.module.css";

export default function Work() {
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const open = (nextImages: ProjectImage[], nextIndex: number) => {
    setImages(nextImages);
    setIndex(nextIndex);
  };

  return (
    <section className={`section ${styles.section}`} id="trabalho">
      <div className="container">
        <header className={styles.head}>
          <Reveal as="p" className="eyebrow">
            Trabalho selecionado
          </Reveal>
          <Reveal as="h2" className={`display ${styles.title}`} delay={0.06}>
            Projetos <em>reais</em>, do conceito à entrega
          </Reveal>
          <Reveal as="p" className={`lede ${styles.lede}`} delay={0.1}>
            Interfaces, websites e identidade visual desenvolvidos ao longo da formação e em
            trabalho freelance.
          </Reveal>
        </header>

        <div className={styles.list}>
          {projects.map((project) => (
            <ProjectRow key={project.slug} project={project} onOpen={open} />
          ))}
        </div>
      </div>

      <Lightbox images={images} index={index} onClose={() => setIndex(null)} onIndexChange={setIndex} />
    </section>
  );
}
