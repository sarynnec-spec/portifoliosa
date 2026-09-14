"use client";

import { useState } from "react";
import { profile } from "@/content/profile";
import Buddy from "./Buddy";
import Reveal from "./Reveal";
import styles from "./Contact.module.css";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  /* A mascote ao lado reage a este estado. */
  const [happy, setHappy] = useState(false);
  /* Enquanto o clip da reação está no ar, o laranja da secção troca de
     afinação — os dois clips não têm o mesmo fundo. */
  const [reagindo, setReagindo] = useState(false);

  /* Os três botões alegram a personagem: passar por cima chega, e o teclado
     conta na mesma pelo foco. */
  const alegra = {
    onPointerEnter: () => setHappy(true),
    onPointerLeave: () => setHappy(false),
    onFocus: () => setHappy(true),
    onBlur: () => setHappy(false),
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      /* Copiou: festeja mesmo que o rato já tenha saído do botão. */
      setHappy(true);
      window.setTimeout(() => setCopied(false), 2000);
      window.setTimeout(() => setHappy(false), 2600);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  /* Sem `section--night`: essa classe troca --ink pelo creme do texto claro,
     que sobre laranja não se lê. Aqui a tinta normal é que serve. */
  return (
    <section
      className={`section ${styles.section} ${reagindo ? styles.reagindo : ""}`.trim()}
      id="contacto"
    >
      {/* A personagem ocupa o palco todo, atrás do texto — como no Чубака,
          que é a referência. O texto fica por cima, à esquerda. */}
      <div className={styles.palco}>
        <Buddy happy={happy} onReacao={setReagindo} />
      </div>

      <div className={`container ${styles.frente}`}>
        <div className={styles.texto}>
          <Reveal as="p" className="eyebrow">
            Contacto
          </Reveal>

          <Reveal as="h2" className={`display ${styles.title}`} delay={0.06}>
            Pronta para o próximo <em>projeto</em>.
          </Reveal>

          <Reveal as="p" className={styles.lede} delay={0.1}>
            {profile.availability}. Se a sua equipa precisa de criatividade e dedicação, vamos falar.
          </Reveal>
        </div>

        <Reveal className={styles.hire} delay={0.14}>
          <div className={styles.hireSide}>
            <a className={`${styles.primary} ${styles.cta}`} href={`mailto:${profile.email}`} {...alegra}>
              Contactar {profile.firstName}
              <span aria-hidden="true">↗</span>
            </a>

            <div className={styles.actions}>
              <a className={styles.ghost} href={`mailto:${profile.email}`} {...alegra}>
                {profile.email}
                <span aria-hidden="true">↗</span>
              </a>
              <button type="button" className={styles.ghost} onClick={copyEmail} {...alegra}>
                {copied ? "E-mail copiado" : "Copiar e-mail"}
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal className={styles.canais} delay={0.18}>
          <dl className={styles.channels}>
            <div className={styles.channel}>
              <dt>Telefone</dt>
              <dd>
                <a href={`tel:${profile.phoneHref}`}>{profile.phone}</a>
              </dd>
            </div>
            <div className={styles.channel}>
              <dt>WhatsApp</dt>
              <dd>
                <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
                  Abrir conversa ↗
                </a>
              </dd>
            </div>
            <div className={styles.channel}>
              <dt>Localização</dt>
              <dd>{profile.location}</dd>
            </div>
            <div className={styles.channel}>
              <dt>Currículo</dt>
              <dd>
                <a href={profile.cvFile} download>
                  PDF ↓
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
