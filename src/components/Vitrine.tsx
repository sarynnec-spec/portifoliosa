"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
import { vitrine } from "@/content/vitrine";
import styles from "./Vitrine.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Quanto tempo cada peça fica em destaque antes de a seguinte tomar o lugar. */
const PAUSA = 4600;

/**
 * Vídeo para marcas, num baralho de cartões — desenho tirado da referência
 * que ela mandou: o baralho à esquerda, a peça em destaque à direita com o
 * texto por cima da imagem, e o baralho a passar sozinho.
 *
 * ⚠️ **No baralho estão IMAGENS, não vídeos.** Só a peça em destaque é um
 * `<video>`. Quatro vídeos montados ao mesmo tempo descarregavam-se todos mal
 * a secção entrasse em vista, e três deles só para ficarem parados atrás — é
 * a mesma razão por que o carrossel do Motion só monta a peça activa.
 *
 * O relógio só anda com a secção em vista: a passar sozinho fora do ecrã, a
 * peça que se encontra ao chegar seria à sorte, e o vídeo continuava a gastar
 * rede sem ninguém o ver.
 */
export default function Vitrine() {
  const total = vitrine.length;
  const [activo, setActivo] = useState(0);
  const [emVista, setEmVista] = useState(false);
  const [parado, setParado] = useState(false);
  const [comSom, setComSom] = useState(false);

  const seccao = useRef<HTMLElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);

  const peca = vitrine[activo];

  const ir = useCallback(
    (passo: number) => setActivo((i) => (i + passo + total) % total),
    [total],
  );

  useEffect(() => {
    const node = seccao.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entrada]) => setEmVista(entrada.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // `setTimeout` rearmado a cada passagem, e não `setInterval`: assim um
  // clique recomeça a contagem do zero, em vez de a peça escolhida saltar
  // fora porque o intervalo já ia a meio.
  useEffect(() => {
    if (!emVista || parado) return;
    const t = setTimeout(() => ir(1), PAUSA);
    return () => clearTimeout(t);
  }, [emVista, parado, activo, ir]);

  // Trocar de peça troca o ficheiro: o som volta a desligado, senão o botão
  // dizia «desligar som» sobre um vídeo que já arrancou mudo.
  useEffect(() => {
    setComSom(false);
  }, [activo]);

  /*
   * ⚠️ O arranque tem de vir pela REFERÊNCIA, não de um efeito com `activo`
   * nas dependências. Com `AnimatePresence mode="wait"`, ao trocar de peça o
   * vídeo novo só é montado DEPOIS de o antigo acabar de sair: um efeito
   * disparado na mudança corre meio segundo antes de o elemento existir,
   * encontra a referência ainda no vídeo que está a sair, e o novo ficava
   * parado no poster a partir da segunda peça. Foi exactamente isso que ela
   * viu — «o video nao esta rodando esta como se fosse foto».
   *
   * Pôr `autoPlay` no elemento também resolvia o arranque, mas punha os
   * vídeos a descarregar-se mal a página abrisse, com a secção ainda fora de
   * vista lá por baixo.
   */
  const ligarVideo = useCallback(
    (node: HTMLVideoElement | null) => {
      video.current = node;
      if (node && emVista) node.play().catch(() => {});
    },
    [emVista],
  );

  // Sair de vista pára o que estiver a tocar; voltar a entrar é tratado pela
  // referência acima, que o React volta a chamar quando `emVista` muda.
  useEffect(() => {
    if (!emVista) video.current?.pause();
  }, [emVista]);

  const alternarSom = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setComSom(!v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <section className={`section ${styles.section}`} id="vitrine" ref={seccao}>
      <div className="container">
        <header className={styles.head}>
          <Reveal as="p" className="eyebrow">
            Vídeo para marcas
          </Reveal>
          <Reveal as="h2" className={`display ${styles.title}`} delay={0.06}>
            Peças montadas sobre <em>imagens do cliente</em>
          </Reveal>
          <Reveal as="p" className={`lede ${styles.lede}`} delay={0.1}>
            Imobiliária, restauração e retalho. As imagens vêm da marca; o que é meu é a
            montagem, o ritmo e o grafismo por cima. O baralho passa sozinho — carregue num
            cartão para o pôr em destaque.
          </Reveal>
        </header>

        <div
          className={styles.palco}
          onMouseEnter={() => setParado(true)}
          onMouseLeave={() => setParado(false)}
          onFocusCapture={() => setParado(true)}
          onBlurCapture={() => setParado(false)}
        >
          <Baralho activo={activo} aoEscolher={setActivo} />

          <AnimatePresence mode="wait">
            <motion.article
              key={peca.slug}
              className={styles.destaque}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <span className={styles.destaqueEcra} style={{ aspectRatio: peca.ratio }}>
                <video
                  ref={ligarVideo}
                  src={peca.video}
                  poster={peca.poster}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={peca.alt}
                />
              </span>

              <div className={styles.destaqueTexto}>
                <h3 className={styles.destaqueNome}>{peca.titulo}</h3>
                <p className={styles.destaqueCategoria}>{peca.categoria}</p>
                <p className={styles.destaqueDescricao}>{peca.descricao}</p>

                <div className={styles.destaqueFundo}>
                  <span className={styles.destaqueFicha}>{peca.ficha}</span>
                  <button type="button" className={styles.som} onClick={alternarSom}>
                    {comSom ? "Som" : "Ouvir"}
                    <span aria-hidden="true">{comSom ? "◼" : "▶"}</span>
                  </button>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/**
 * O baralho: a peça em destaque à frente, as outras atrás, por ordem.
 *
 * A posição de cada cartão não é escrita à mão — sai da DISTÂNCIA à peça
 * activa, a contar pela volta. Assim o baralho continua certo com quatro
 * peças ou com dez, e nunca há um cartão sem posição definida.
 */
function Baralho({
  activo,
  aoEscolher,
}: {
  activo: number;
  aoEscolher: (i: number) => void;
}) {
  const total = vitrine.length;
  const reduced = useReducedMotion();

  return (
    <div className={styles.baralho}>
      {vitrine.map((peca, i) => {
        const atras = (i - activo + total) % total;
        const frente = atras === 0;

        return (
          <motion.button
            type="button"
            key={peca.slug}
            className={styles.cartao}
            onClick={() => aoEscolher(i)}
            aria-label={`Pôr ${peca.titulo} em destaque`}
            aria-current={frente}
            animate={
              reduced
                ? { opacity: frente ? 1 : 0.5, zIndex: total - atras }
                : {
                    /*
                     * O desvio é medido na referência: lá os cartões afastam-se
                     * ~55 px num cartão de ~226 px, ou seja cerca de 24% da
                     * largura. À primeira pus 18 px num cartão de 240 (7%) e o
                     * baralho lia-se como um cartão só com uma aresta atrás.
                     * 34 px em 240 dá os mesmos ~14% por cartão e os três
                     * degraus somam os 24% da referência.
                     *
                     * O `padding` do baralho no CSS acompanha estes números
                     * (6,4rem à direita, 2,4rem em baixo): 3 × 34 = 102 px e
                     * 3 × 12 = 36 px cabem lá dentro, por isso os cartões de
                     * trás nunca empurram a página para o lado.
                     */
                    x: atras * 34,
                    y: atras * 12,
                    rotate: atras * 2.2,
                    scale: 1 - atras * 0.04,
                    opacity: 1 - atras * 0.18,
                    zIndex: total - atras,
                  }
            }
            transition={{ duration: 0.55, ease: EASE }}
          >
            <span className={styles.cartaoImagem} style={{ aspectRatio: peca.ratio }}>
              <img src={peca.poster} alt="" loading="lazy" />
            </span>
            <span className={styles.cartaoInfo}>
              <span className={styles.cartaoNome}>{peca.titulo}</span>
              <span className={styles.cartaoSelo}>{peca.index}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
