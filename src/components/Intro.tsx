"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { introPlays, markIntroDone } from "@/lib/introGate";
import { tocarAbertura } from "@/lib/introSom";
import styles from "./Intro.module.css";

/** O nome próprio dá as letras — e cada letra dá uma coluna. */
const LETTERS = profile.firstName.toUpperCase().split("");
const N = LETTERS.length;

/** Um arco-íris inteiro repartido pelas letras: o aceno ao Umbrella Sky. */
const hue = (i: number) => 8 + (i * 330) / (N - 1);

/* Espelham os tempos de Intro.module.css. */
const T_OUT = 2450;
const ST_OUT = 40;
const D_OUT = 600;
const TOTAL = T_OUT + ST_OUT * (N - 1) + D_OUT + 60;

export default function Intro() {
  const [visible, setVisible] = useState(true);
  const [skipping, setSkipping] = useState(false);
  const [passing, setPassing] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const word = useRef<HTMLParagraphElement | null>(null);
  const chips = useRef<(HTMLSpanElement | null)[]>([]);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const calarSom = useRef<(() => void) | null>(null);
  /*
   * Muda quando alguém liga o som. Serve de chave ao palco: o browser só
   * reinicia uma animação CSS se o elemento for outro, e a abertura tem de
   * voltar ao princípio para o som apanhar as pastilhas desde a primeira.
   */
  const [ciclo, setCiclo] = useState(0);
  /* O botão do som é da entrada: a partir do momento em que se começa a ler
     o site, não tem nada que continuar a pedir atenção. */
  const [noTopo, setNoTopo] = useState(true);

  /* O clique que liga o som é o mesmo que o browser exige para o autorizar. */
  const ligarSom = (evento: React.MouseEvent) => {
    /* Sem isto, o clique subia até ao palco e saltava a abertura. */
    evento.stopPropagation();
    calarSom.current?.();
    /*
     * A encenação arranca no aviso do motor de áudio, não no toque. Custa o
     * tempo que o motor leva a acordar — só no primeiro toque, porque depois
     * fica vivo — e em troca a imagem e o som partem juntos.
     */
    calarSom.current = tocarAbertura(N, () => {
      setSkipping(false);
      setPassing(false);
      setVisible(true);
      setCiclo((n) => n + 1);
    });
  };

  /* Cada coluna arranca no sítio, no tamanho e na forma da pastilha da sua
     letra, e só depois desabrocha. As medidas vêm do layout (offset*), não de
     getBoundingClientRect — as animações já estão a mexer nas transformações. */
  useLayoutEffect(() => {
    /*
     * `introPlays` decide se a abertura toca SOZINHA — já vista nesta sessão,
     * ou sistema a pedir menos movimento. Não pode mandar no botão: quem
     * carrega nele está a pedi-la de propósito, e a partir do primeiro ciclo
     * este portão deixa de se aplicar.
     */
    if (!introPlays && ciclo === 0) {
      setVisible(false);
      return;
    }

    const measure = () => {
      const box = word.current?.getBoundingClientRect();
      if (!box) return;
      chips.current.forEach((chip, i) => {
        const col = cols.current[i];
        const letter = chip?.parentElement;
        if (!chip || !col || !letter) return;
        const slot = col.getBoundingClientRect();
        if (!slot.width || !slot.height || !chip.offsetWidth) return;

        const cx = box.left + letter.offsetLeft + chip.offsetLeft + chip.offsetWidth / 2;
        const cy = box.top + letter.offsetTop + chip.offsetTop + chip.offsetHeight / 2;

        col.style.setProperty("--dx", `${cx - (slot.left + slot.width / 2)}px`);
        col.style.setProperty("--dy", `${cy - (slot.top + slot.height / 2)}px`);
        col.style.setProperty("--sx", `${chip.offsetWidth / slot.width}`);
        col.style.setProperty("--sy", `${chip.offsetHeight / slot.height}`);
      });
    };

    measure();
    /* As letras assentam quando a fonte chega; volta a medir aí. Há folga de
       sobra: as colunas só arrancam a 1,35 s. */
    document.fonts?.ready.then(measure).catch(() => undefined);
  }, [ciclo]);

  /* Nada de rolar por trás da cortina. */
  useEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      html.style.overflow = before;
    };
  }, [visible]);

  /* Sequência normal: a página acorda quando a cortina começa a subir, para
     que a entrada do hero se veja a acontecer, e não já feita. */
  useEffect(() => {
    if (!visible || skipping) return;
    const wake = window.setTimeout(() => {
      markIntroDone();
      setPassing(true);
    }, T_OUT);
    const end = window.setTimeout(() => setVisible(false), TOTAL);
    return () => {
      window.clearTimeout(wake);
      window.clearTimeout(end);
    };
  }, [visible, skipping, ciclo]);

  /* Um clique ou uma tecla corta a encenação. */
  useEffect(() => {
    if (!visible || skipping) return;
    const skip = () => setSkipping(true);
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [visible, skipping]);

  /* Some depois de passar o primeiro ecrã, e volta se a pessoa subir. */
  useEffect(() => {
    const olhar = () => setNoTopo(window.scrollY < window.innerHeight * 0.6);
    olhar();
    window.addEventListener("scroll", olhar, { passive: true });
    return () => window.removeEventListener("scroll", olhar);
  }, []);

  useEffect(() => {
    if (!skipping) return;
    calarSom.current?.();
    markIntroDone();
    const end = window.setTimeout(() => setVisible(false), 350);
    return () => window.clearTimeout(end);
  }, [skipping]);

  /*
   * Acabada a abertura fica só o botão. Antes desaparecia com ela, e como a
   * encenação dura 3,35 s ninguém tinha tempo de lhe chegar — um botão que
   * some antes de ser visto não é um botão.
   */
  if (!visible) {
    return (
      <button
        type="button"
        className={`${styles.som} ${styles.somFixo}`}
        data-longe={noTopo ? undefined : ""}
        onClick={ligarSom}
      >
        <span className={styles.somBarras} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        Abertura com som
      </button>
    );
  }

  return (
    <div
      key={ciclo}
      ref={root}
      className={`${styles.root} ${passing ? styles.passing : ""} ${
        skipping ? styles.skipping : ""
      }`.replace(/\s+/g, " ").trim()}
      style={{ "--last": N - 1 } as React.CSSProperties}
      onClick={() => setSkipping(true)}
    >
      <button type="button" className={styles.som} onClick={ligarSom}>
        <span className={styles.somBarras} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {ciclo === 0 ? "Abertura com som" : "Repetir"}
      </button>

      <div className={styles.columns} aria-hidden="true">
        {LETTERS.map((letter, i) => (
          <div
            key={`col-${letter}-${i}`}
            ref={(el) => {
              cols.current[i] = el;
            }}
            className={styles.col}
            style={{ "--i": i } as React.CSSProperties}
          >
            <span
              className={styles.colFill}
              style={{ "--c": `hsl(${hue(i)} 78% 56%)` } as React.CSSProperties}
            />
          </div>
        ))}
      </div>

      <p className={styles.word} ref={word} aria-hidden="true">
        {LETTERS.map((letter, i) => (
          <span
            key={`letter-${letter}-${i}`}
            className={styles.letter}
            style={{ "--i": i } as React.CSSProperties}
          >
            <span
              ref={(el) => {
                chips.current[i] = el;
              }}
              className={styles.chip}
              style={{ "--cs": `hsl(${hue(i)} 95% 76%)` } as React.CSSProperties}
            />
            <span className={styles.glyph}>{letter}</span>
          </span>
        ))}
      </p>

      <p className={styles.sub} aria-hidden="true">
        {profile.lastName} · {profile.role}
      </p>
    </div>
  );
}
