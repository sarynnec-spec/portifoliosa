"use client";

import { reels } from "@/content/reels";
import Reveal from "./Reveal";
import VideoMockup from "./VideoMockup";
import styles from "./Motion.module.css";

/**
 * Secção dedicada ao motion graphics.
 *
 * Os reels estavam espalhados pela lista de trabalho, entre sites e
 * identidade. Aqui ficam juntos, todos no mesmo formato vertical, para quem
 * procura vídeo ver tudo de uma vez.
 */
export default function Motion() {
  return (
    <section className={`section ${styles.section}`} id="motion">
      <div className="container">
        <header className={styles.head}>
          <Reveal as="p" className="eyebrow">
            Motion graphics
          </Reveal>
          <Reveal as="h2" className={`display ${styles.title}`} delay={0.06}>
            Vídeo vertical, feito <em>fotograma a fotograma</em>
          </Reveal>
          <Reveal as="p" className={`lede ${styles.lede}`} delay={0.1}>
            Reels e anúncios para Instagram, TikTok e Meta Ads: tempo, ritmo e sincronização
            com a música tratados como parte do desenho, não como acabamento.
          </Reveal>
        </header>

        <div className={styles.lista}>
          {reels.map((reel) => (
            <article className={styles.reel} key={reel.slug}>
              <Reveal className={styles.palco}>
                <VideoMockup src={reel.video} poster={reel.poster} alt={reel.alt} />
              </Reveal>

              <div className={styles.texto}>
                <Reveal className={styles.cabeca} delay={0.06}>
                  <span className={styles.index}>{reel.index}</span>
                  <h3 className={styles.nome}>{reel.title}</h3>
                  <p className={styles.categoria}>{reel.category}</p>
                </Reveal>

                <Reveal as="p" className={styles.ficha} delay={0.1}>
                  {reel.ficha}
                </Reveal>

                <Reveal as="p" className={styles.descricao} delay={0.12}>
                  {reel.description}
                </Reveal>

                <Reveal as="ul" className={styles.pontos} delay={0.16}>
                  {reel.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </Reveal>

                <Reveal as="ul" className={styles.stack} delay={0.2}>
                  {reel.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
