"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { reels, type Reel } from "@/content/reels";
import AnimacaoCanto from "./AnimacaoCanto";
import Reveal from "./Reveal";
import VideoMockup from "./VideoMockup";
import styles from "./Motion.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Arrasto mínimo, em píxeis, para contar como «passar à seguinte». */
const LIMIAR_ARRASTO = 70;

/**
 * Seta com a haste a crescer e a ponta a sair à frente.
 *
 * A animação parada (`animate`) é o que diz que isto se carrega: a ponta
 * dá um passo para o lado e volta, devagar. Ao passar o rato a haste abre
 * toda. Com «reduzir movimento» ligado fica quieta — continua a funcionar.
 */
function Seta({ sentido }: { sentido: 1 | -1 }) {
  const reduced = useReducedMotion();

  return (
    <svg
      className={styles.setaIcone}
      viewBox="0 0 34 12"
      fill="none"
      aria-hidden="true"
      style={{ transform: `scaleX(${sentido})` }}
    >
      <motion.line
        x1="2"
        y1="6"
        x2="26"
        y2="6"
        stroke="currentColor"
        strokeWidth="1.2"
        variants={{ parado: { pathLength: 0.7 }, tocado: { pathLength: 1 } }}
        transition={{ duration: 0.45, ease: EASE }}
      />
      {/*
       * Dois níveis de propósito: o `g` obedece ao rato (variantes herdadas
       * do botão) e a ponta lá dentro faz o passo parado. Num elemento só,
       * o `animate` do passo cortava a herança das variantes.
       */}
      <motion.g variants={{ parado: { x: 0 }, tocado: { x: 4.5 } }}>
        <motion.path
          d="M21 1.5 L26 6 L21 10.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="square"
          animate={reduced ? { x: 0 } : { x: [0, 2.5, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>
    </svg>
  );
}

/**
 * A peça vizinha, ao lado da que está a tocar.
 *
 * É o que diz que há mais vídeos dos dois lados — com uma peça só ao centro
 * ninguém adivinha que o carrossel continua. Vai só a imagem de capa e não o
 * vídeo: seis vídeos montados ao mesmo tempo eram seis descarregamentos.
 * Clicar nela traz-na para o centro.
 */
function Vizinho({
  reel,
  lado,
  aoTocar,
}: {
  reel: Reel;
  lado: "ant" | "seg";
  aoTocar: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.vizinho} ${lado === "ant" ? styles.vizinhoAnt : styles.vizinhoSeg}`}
      onClick={aoTocar}
      tabIndex={-1}
      aria-hidden="true"
    >
      <img
        src={reel.poster}
        alt=""
        loading="lazy"
        style={{ aspectRatio: reel.ratio === "9/16" ? "9 / 16" : "4 / 5" }}
      />
    </button>
  );
}

/**
 * Secção dedicada ao motion graphics.
 *
 * Os reels estavam espalhados pela lista de trabalho, entre sites e
 * identidade. Aqui ficam juntos — e deixaram de estar uns por baixo dos
 * outros: passa-se de um para o outro pelas setas, pelo teclado, arrastando,
 * ou clicando na peça vizinha.
 *
 * O vídeo vai ao meio, sozinho, com as vizinhas de cada lado; as setas ficam
 * logo por baixo dele, para se ir passando e vendo sem procurar o comando; e
 * só depois vem a ficha escrita. Com o texto ao lado do vídeo — como esteve
 * — a coluna do vídeo ficava estreita e as vizinhas não tinham onde caber.
 */
export default function Motion() {
  const total = reels.length;
  const [ativo, setAtivo] = useState(0);
  /* +1 veio da direita, −1 veio da esquerda — decide para que lado desliza. */
  const [sentido, setSentido] = useState(1);
  const palco = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const ir = useCallback(
    (passo: number) => {
      setSentido(passo >= 0 ? 1 : -1);
      setAtivo((i) => (i + passo + total) % total);
    },
    [total],
  );

  /* Setas do teclado, mas só enquanto o carrossel está em foco: senão
     roubava as setas a quem só quer rolar a página. */
  useEffect(() => {
    const node = palco.current;
    if (!node) return;

    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        ir(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        ir(-1);
      }
    };

    node.addEventListener("keydown", aoTeclar);
    return () => node.removeEventListener("keydown", aoTeclar);
  }, [ir]);

  const reel = reels[ativo];
  /* Dão a volta: a anterior da primeira é a última. */
  const anterior = (ativo - 1 + total) % total;
  const seguinte = (ativo + 1) % total;

  /* O mesmo deslize para o vídeo e para a ficha — mudam ao mesmo tempo. */
  const desliza = {
    entra: (s: number) => ({ opacity: 0, x: reduced ? 0 : s * 56 }),
    centro: { opacity: 1, x: 0 },
    sai: (s: number) => ({ opacity: 0, x: reduced ? 0 : s * -56 }),
  };

  return (
    <section className={`section ${styles.section}`} id="motion">
      <div className="container">
        <div className={styles.topo}>
          <header className={styles.head}>
            <Reveal as="p" className={`eyebrow ${styles.eyebrowLinha}`}>
              Vídeos
            </Reveal>
            <Reveal as="h2" className={`display ${styles.title}`} delay={0.06}>
              Vídeo vertical, feito em <em>motion graphics</em>
            </Reveal>
            <Reveal as="p" className={`lede ${styles.lede}`} delay={0.1}>
              Peças de marca, reels e anúncios: tempo, ritmo e sincronização com o som tratados
              como parte do desenho, não como acabamento. Passe pelas setas para ver as{" "}
              {total} peças.
            </Reveal>
          </header>

          <Reveal className={styles.canto} delay={0.16}>
            <AnimacaoCanto />
          </Reveal>
        </div>

        <div
          className={styles.palco}
          ref={palco}
          tabIndex={0}
          role="group"
          aria-roledescription="carrossel"
          aria-label="Peças de motion graphics"
        >
          <div className={styles.palcoVideo}>
            {/*
             * As vizinhas medem-se a partir desta caixa, não do palco todo:
             * é o que as mantém sempre à mesma distância do vídeo. Encostadas
             * ao palco — que é a largura da página — ficavam fora do corte e
             * desapareciam por completo no desktop.
             */}
            <div
              className={`${styles.grupo} ${
                reel.ratio === "9/16" ? styles.grupoFone : styles.grupoFeed
              }`}
            >
              <Vizinho reel={reels[anterior]} lado="ant" aoTocar={() => ir(-1)} />

              <AnimatePresence mode="wait" custom={sentido} initial={false}>
                <motion.div
                  key={reel.slug}
                  custom={sentido}
                  variants={desliza}
                  initial="entra"
                  animate="centro"
                  exit="sai"
                  transition={{ duration: 0.5, ease: EASE }}
                  drag={reduced ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.14}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -LIMIAR_ARRASTO) ir(1);
                    else if (info.offset.x > LIMIAR_ARRASTO) ir(-1);
                  }}
                  className={styles.centro}
                >
                  <VideoMockup
                    src={reel.video}
                    poster={reel.poster}
                    alt={reel.alt}
                    ratio={reel.ratio}
                    temSom={reel.temSom ?? true}
                  />
                </motion.div>
              </AnimatePresence>

              <Vizinho reel={reels[seguinte]} lado="seg" aoTocar={() => ir(1)} />
            </div>
          </div>

          {/* Logo por baixo do vídeo: passa-se e vê-se, sem procurar o comando. */}
          <div className={styles.comandos}>
            <motion.button
              type="button"
              className={styles.seta}
              onClick={() => ir(-1)}
              aria-label="Peça de motion anterior"
              initial="parado"
              whileHover="tocado"
              whileFocus="tocado"
            >
              <Seta sentido={-1} />
              <span className={styles.setaTexto}>Anterior</span>
            </motion.button>

            <div className={styles.conta} aria-hidden="true">
              <span className={styles.contaAtual}>
                {String(ativo + 1).padStart(2, "0")}
              </span>
              <span className={styles.contaBarra} />
              <span className={styles.contaTotal}>{String(total).padStart(2, "0")}</span>
            </div>

            <motion.button
              type="button"
              className={styles.seta}
              onClick={() => ir(1)}
              aria-label="Peça de motion seguinte"
              initial="parado"
              whileHover="tocado"
              whileFocus="tocado"
            >
              <span className={styles.setaTexto}>Seguinte</span>
              <Seta sentido={1} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait" custom={sentido} initial={false}>
            <motion.article
              className={styles.texto}
              key={reel.slug}
              custom={sentido}
              variants={desliza}
              initial="entra"
              animate="centro"
              exit="sai"
              transition={{ duration: 0.5, ease: EASE }}
              aria-roledescription="peça"
              aria-label={`${ativo + 1} de ${total}: ${reel.title}`}
            >
              <div className={styles.cabeca}>
                <span className={styles.index}>{reel.index}</span>
                <h3 className={styles.nome}>{reel.title}</h3>
                <p className={styles.categoria}>{reel.category}</p>
                <p className={styles.ficha}>{reel.ficha}</p>
              </div>

              <div className={styles.corpo}>
                <p className={styles.descricao}>{reel.description}</p>

                <ul className={styles.pontos}>
                  {reel.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <ul className={styles.stack}>
                {reel.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
