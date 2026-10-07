import { education, roles, skills } from "@/content/experience";
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

        <div className={styles.split}>
          <div className={styles.block}>
            <Reveal as="h3" className={styles.blockTitle}>
              Formação académica
            </Reveal>
            <ol className={styles.education}>
              {education.map((item, i) => (
                <Reveal as="li" className={styles.educationItem} key={item.course} delay={i * 0.05}>
                  <span className={styles.period}>{item.period}</span>
                  <div>
                    <p className={styles.educationCourse}>
                      {item.course}
                      {item.status && <span className={styles.badge}>{item.status}</span>}
                    </p>
                    <p className={styles.company}>{item.school}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          <div className={styles.block}>
            <Reveal as="h3" className={styles.blockTitle}>
              Competências
            </Reveal>
            <Reveal delay={0.06}>
              <ul className={styles.skills}>
                {skills.map((skill) => (
                  <li className={styles.skill} key={skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
