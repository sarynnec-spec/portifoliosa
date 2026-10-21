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

  /*
   * Qualquer meio de contacto alegra a personagem: passar por cima chega, e
   * o teclado conta na mesma pelo foco.
   *
   * 🔴 Isto estava posto À MÃO em três sítios — o botão principal, o link do
   * e-mail e o «Copiar e-mail» — e ficavam de fora o telefone, o WhatsApp e
   * os dois currículos: passava-se o rato por cima deles e ele não levantava
   * os braços. Ela apanhou.
   *
   * Agora é UM par de ouvintes no contentor de todos eles. `pointerover` e
   * `pointerout` sobem na árvore (ao contrário de `pointerenter`/`leave`),
   * por isso apanham todos os links e botões lá dentro — e os que vierem a
   * seguir, sem ninguém se lembrar de os marcar.
   */
  const ehContacto = (alvo: EventTarget | null) =>
    alvo instanceof HTMLElement && alvo.closest("a, button") !== null;

  const alegra = {
    onPointerOver: (e: React.PointerEvent) => {
      if (ehContacto(e.target)) setHappy(true);
    },
    onPointerOut: (e: React.PointerEvent) => {
      if (!ehContacto(e.target)) return;
      /* Sair de um contacto DIRECTAMENTE para outro não baixa os braços: sem
         isto, passar o rato ao longo da lista fazia-o recomeçar o gesto a
         cada link e lia-se como um tremor. */
      if (ehContacto(e.relatedTarget)) return;
      setHappy(false);
    },
    onFocus: (e: React.FocusEvent) => {
      if (ehContacto(e.target)) setHappy(true);
    },
    onBlur: (e: React.FocusEvent) => {
      if (!ehContacto(e.target)) return;
      if (ehContacto(e.relatedTarget)) return;
      setHappy(false);
    },
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

      {/* Os ouvintes vivem aqui, no contentor que leva TODOS os contactos. */}
      <div className={`container ${styles.frente}`} {...alegra}>
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
            <a className={`${styles.primary} ${styles.cta}`} href={`mailto:${profile.email}`}>
              Contactar {profile.firstName}
              <span aria-hidden="true">↗</span>
            </a>

            <div className={styles.actions}>
              <a className={styles.ghost} href={`mailto:${profile.email}`}>
                {profile.email}
                <span aria-hidden="true">↗</span>
              </a>
              <button type="button" className={styles.ghost} onClick={copyEmail}>
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
                <a href={profile.cvFile} download hrefLang="pt">
                  PT ↓
                </a>
                <span className={styles.canalSep} aria-hidden="true">
                  ·
                </span>
                <a href={profile.cvFileEn} download hrefLang="en">
                  EN ↓
                </a>
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
