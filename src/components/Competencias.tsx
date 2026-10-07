"use client";

import { areas } from "@/content/competencias";
import Reveal from "./Reveal";
import styles from "./Competencias.module.css";

/**
 * Competências técnicas em cartões, uma área por cartão.
 *
 * Cada ferramenta leva a sua marca em SVG monocromático, pintada com a cor
 * oficial através da custom property `--marca`: sem isso saíam todas na mesma
 * tinta e deixavam de se distinguir de relance.
 *
 * O ícone é desenhado com `mask`, e não com `<img>`, porque o ficheiro é
 * monocromático e a cor tem de vir do CSS.
 */
export default function Competencias() {
  return (
    <section className={`section ${styles.root}`} id="competencias">
      <div className="shell">
        <Reveal as="p" className="eyebrow">
          Conhecimentos técnicos
        </Reveal>
        <Reveal as="h2" className={styles.titulo} delay={0.04}>
          Competências
        </Reveal>
        <Reveal as="p" className={styles.intro} delay={0.08}>
          Tecnologias e práticas que uso para construir aplicações web — da interface à
          base de dados. Cada ferramenta listada foi usada num dos projetos acima.
        </Reveal>

        <div className={styles.grelha}>
          {areas.map((area, i) => (
            <Reveal
              key={area.titulo}
              className={styles.cartao}
              delay={0.04 * (i % 2) + 0.06}
            >
              <h3 className={styles.areaTitulo}>{area.titulo}</h3>
              <p className={styles.areaDescricao}>{area.descricao}</p>

              <p className={styles.rotulo}>Tecnologias e ferramentas</p>
              <ul className={styles.ferramentas}>
                {area.ferramentas.map((f) => (
                  <li className={styles.ferramenta} key={area.titulo + f.nome}>
                    {f.icone && (
                      <span
                        className={styles.icone}
                        style={
                          {
                            "--marca": f.cor,
                            maskImage: `url(/ferramentas/tec/${f.icone}.svg)`,
                            WebkitMaskImage: `url(/ferramentas/tec/${f.icone}.svg)`,
                          } as React.CSSProperties
                        }
                        aria-hidden="true"
                      />
                    )}
                    {f.nome}
                  </li>
                ))}
              </ul>

              <p className={styles.rotulo}>Práticas e conhecimentos</p>
              <ul className={styles.praticas}>
                {area.praticas.map((pratica) => (
                  <li key={pratica}>{pratica}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
