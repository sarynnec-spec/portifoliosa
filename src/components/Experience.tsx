import { roles } from "@/content/experience";
import { profile } from "@/content/profile";
import Reveal from "./Reveal";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <section className={`section ${styles.section}`} id="percurso">
      <div className="container">
        <div className={styles.top}>
          <div>
            <Reveal as="p" className="eyebrow">
              Percurso
            </Reveal>
            <Reveal as="h2" className={`display ${styles.title}`} delay={0.06}>
              Experiência & <em>formação</em>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className={styles.cvGroup}>
              <a className={styles.cv} href={profile.cvFile} download hrefLang="pt">
                Currículo <span className={styles.cvLang}>PT</span>
                <span aria-hidden="true">↓</span>
              </a>
              <a className={styles.cv} href={profile.cvFileEn} download hrefLang="en">
                Resume <span className={styles.cvLang}>EN</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </Reveal>
        </div>

        <ol className={styles.roles}>
          {roles.map((role, i) => (
            <Reveal as="li" className={styles.role} key={`${role.company}-${role.period}`} delay={i * 0.04}>
              <span className={styles.period}>{role.period}</span>
              <div className={styles.roleBody}>
                <h3 className={styles.roleTitle}>
                  {role.title}
                  {role.current && <span className={styles.badge}>Atual</span>}
                </h3>
                <p className={styles.company}>{role.company}</p>
                {role.detail && <p className={styles.detail}>{role.detail}</p>}
              </div>
            </Reveal>
          ))}
        </ol>

        {/*
          Aqui estavam dois blocos, ambos retirados a pedido dela:

          - «Competências», por repetir a secção Competências. ⚠️ Antes de a
            apagar, as dez foram conferidas contra `competencias.ts`: NENHUMA
            lá estava — as áreas eram todas técnicas. Daí terem nascido lá as
            áreas «Design e marca» e «Marketing e relação comercial». Apagar
            sem isso teria deitado fora a frente de design e a comercial.

          - «Formação académica», porque *"já tem no currículo"* — e tem: o
            currículo descarrega-se no topo desta mesma secção, em PT e EN.

          Os dados de ambos continuam em `experience.ts`, sem serem
          mostrados: são a lista do CV, e é por aí que se confere quando o
          currículo mudar.
        */}
      </div>
    </section>
  );
}
