import { services } from "@/content/services";
import Reveal from "./Reveal";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <section className={`section section--night ${styles.section}`} id="servicos">
      <div className="container">
        <header className={styles.head}>
          <Reveal as="p" className="eyebrow">
            O que faço
          </Reveal>
          <Reveal as="h2" className={`display ${styles.title}`} delay={0.06}>
            Serviços & <em>competências</em>
          </Reveal>
          <Reveal as="p" className={`lede ${styles.lede}`} delay={0.1}>
            Design e presença digital ponta a ponta — da identidade visual à campanha que gera
            resultado.
          </Reveal>
        </header>

        <ol className={styles.list}>
          {services.map((service, i) => (
            <Reveal as="li" className={styles.row} key={service.index} delay={i * 0.05}>
              <span className={styles.index}>{service.index}</span>
              <h3 className={styles.rowTitle}>{service.title}</h3>
              <p className={styles.rowText}>{service.description}</p>
              <ul className={styles.tools}>
                {service.tools.map((tool) => (
                  <li className={styles.tool} key={tool}>
                    {tool}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
