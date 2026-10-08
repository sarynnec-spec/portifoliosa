"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { services } from "@/content/services";
import { prepararSom, tocarGiro } from "@/lib/somRoleta";
import styles from "./Roleta.module.css";

/**
 * Contador rotativo — o painel de placas que gira e para numa palavra.
 *
 * Cada coluna é um tambor: uma fita vertical de caracteres dentro de uma
 * janela que só mostra um e deixa ver de raspão o de cima e o de baixo. É
 * esse par de fatias cortadas que lê como cilindro; sem elas seriam letras a
 * saltar numa caixa.
 *
 * As colunas arrancam todas juntas e travam uma a uma, da esquerda para a
 * direita — medido no vídeo de referência em ~45 ms entre vizinhas.
 */

const COLUNAS = 9;

/** O que um tambor destes sabe mostrar. Sem acentos: um painel mecânico não os tem. */
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./+";

/** Duração da primeira coluna, em ms. */
const DUR_BASE = 1150;

/** Atraso acumulado por cada coluna à direita, em ms. */
const ESCALONAR = 45;

/** Letras que a primeira coluna percorre antes de travar. */
const PASSOS_BASE = 26;

/**
 * Rola quase a velocidade constante e trava no fim, depressa.
 *
 * Medido no vídeo de referência a 30 fps: a última letra de uma coluna entra
 * em três a quatro fotogramas — 60 a 100 ms. Com esta curva entra em 93 ms, e
 * as três últimas gastam 194 ms ao todo.
 *
 * A primeira tentativa foi uma desaceleração forte, que no papel parecia mais
 * mecânica e estava errada: dava 465 ms só na última letra — meio segundo de
 * rasto que a referência não tem em lado nenhum.
 */
const SUAVIZACAO = [0.55, 0.55, 0.88, 1] as const;
const CSS_SUAVIZACAO = `cubic-bezier(${SUAVIZACAO.join(",")})`;

/** Quanto tempo a palavra fica parada antes do giro seguinte, em ms. */
const PAUSA = 2600;

const TOTAL_GIRO = DUR_BASE + (COLUNAS - 1) * ESCALONAR;

const semAcento = (texto: string) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * As palavras são as próprias ferramentas listadas nesta secção — a roleta
 * lê de `services`, e não de uma lista à parte, para nunca anunciar uma
 * competência que a página já deixou de listar.
 *
 * Fica de fora o que não cabe nas nove colunas ou que o tambor não sabe
 * escrever.
 */
const PALAVRAS = Array.from(
  new Set(
    services
      .flatMap((servico) => servico.tools)
      .map((ferramenta) => semAcento(ferramenta).toUpperCase())
      .filter(
        (ferramenta) =>
          ferramenta.length <= COLUNAS &&
          [...ferramenta].every((c) => c === " " || ALFABETO.includes(c)),
      ),
  ),
);

/** Reparte a palavra pelas colunas, centrada, com espaços nas sobras. */
function letras(palavra: string) {
  const esquerda = Math.floor((COLUNAS - palavra.length) / 2);
  return Array.from({ length: COLUNAS }, (_, i) => {
    const k = i - esquerda;
    return k >= 0 && k < palavra.length ? palavra[k] : " ";
  });
}

/**
 * O caráter que fica a seguir no tambor.
 *
 * Tirado do alfabeto por deslocamento e não à sorte: isto corre também no
 * servidor, e dois valores diferentes dos dois lados davam erro de
 * hidratação. Um espaço não está no alfabeto — o tambor tem letras à volta
 * dele na mesma, como teria um painel verdadeiro.
 */
function vizinho(caracter: string, desvio: number) {
  const i = ALFABETO.indexOf(caracter);
  const base = i < 0 ? ALFABETO.indexOf("M") : i;
  return ALFABETO[(base + desvio + ALFABETO.length) % ALFABETO.length];
}

/**
 * A fita em repouso: a letra certa ao centro, e uma de cada lado.
 *
 * Sem as vizinhas o painel parava a mostrar nove retângulos lisos e perdia-se
 * logo a ideia de que há tambores lá dentro — é o que se vê de raspão em cima
 * e em baixo que diz que aquilo pode rodar.
 */
function tiraParada(caracteres: string[]) {
  return caracteres.map((c) => [vizinho(c, -1), c, vizinho(c, 1)]);
}

function bezier(t: number, a: number, b: number) {
  const u = 1 - t;
  return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
}

/**
 * O inverso da curva: dado quanto do percurso já foi feito, quanto tempo
 * passou.
 *
 * Serve para o som. Os estalidos têm de cair quando cada letra passa, e as
 * letras passam ao ritmo da curva — espalhá-los por igual soaria a metrónomo
 * e denunciava logo que não há máquina nenhuma lá dentro.
 */
function tempoPara(progresso: number) {
  const [x1, y1, x2, y2] = SUAVIZACAO;
  let baixo = 0;
  let cima = 1;
  for (let i = 0; i < 24; i += 1) {
    const meio = (baixo + cima) / 2;
    if (bezier(meio, y1, y2) < progresso) baixo = meio;
    else cima = meio;
  }
  return bezier((baixo + cima) / 2, x1, x2);
}

export default function Roleta({ className = "" }: { className?: string }) {
  const [tiras, setTiras] = useState<string[][]>(() => tiraParada(letras(PALAVRAS[0])));
  const [indice, setIndice] = useState(0);
  const [pedido, setPedido] = useState(0);
  const [aGirar, setAGirar] = useState(false);
  const [som, setSom] = useState(true);
  const [semMovimento, setSemMovimento] = useState(false);
  const [visivel, setVisivel] = useState(false);

  const raizRef = useRef<HTMLDivElement | null>(null);
  const janelaRef = useRef<HTMLDivElement | null>(null);
  const fitasRef = useRef<(HTMLDivElement | null)[]>([]);
  const animsRef = useRef<(Animation | null)[]>([]);
  const atuaisRef = useRef<string[]>(letras(PALAVRAS[0]));
  const indiceRef = useRef(0);
  const comSomRef = useRef(false);
  const somLigadoRef = useRef(true);
  const desbloqueadoRef = useRef(false);
  const cortarSomRef = useRef<(() => void) | null>(null);
  const relogioRef = useRef<number | null>(null);

  const girar = useCallback((comSom: boolean) => {
    const proximo = (indiceRef.current + 1) % PALAVRAS.length;
    const alvos = letras(PALAVRAS[proximo]);

    setTiras(
      alvos.map((alvo, i) => {
        /* Mais passos nas colunas da direita, que também levam mais tempo:
           assim todas giram à mesma velocidade e só a travagem é que difere. */
        const passos = PASSOS_BASE + i * 2;
        const meio = Array.from(
          { length: passos - 1 },
          () => ALFABETO[(Math.random() * ALFABETO.length) | 0],
        );
        /* O último não chega a ficar ao centro: é só a vizinha de baixo, para
           o tambor nunca parecer acabar na letra que mostra. */
        return [atuaisRef.current[i], ...meio, alvo, vizinho(alvo, 1)];
      }),
    );

    atuaisRef.current = alvos;
    indiceRef.current = proximo;
    comSomRef.current = comSom;
    setIndice(proximo);
    setAGirar(true);
    setPedido((n) => n + 1);
  }, []);

  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setSemMovimento(consulta.matches);
    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  /* Fora do ecrã não gira: poupa o portátil dela e o de quem visita. */
  useEffect(() => {
    const no = raizRef.current;
    if (!no) return;
    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(entrada.isIntersecting),
      { threshold: 0.35 },
    );
    observador.observe(no);
    return () => observador.disconnect();
  }, []);

  useLayoutEffect(() => {
    const janela = janelaRef.current;
    const fitas = fitasRef.current;
    const primeira = fitas[0];
    if (!janela || !primeira) return;

    const celula = (primeira.firstElementChild as HTMLElement | null)?.getBoundingClientRect()
      .height;
    if (!celula) return;

    /* A fita assenta de modo a pôr a letra ativa no meio da janela; o que
       sobra em cima e em baixo é o que se vê das vizinhas. */
    const centro = (janela.getBoundingClientRect().height - celula) / 2;

    animsRef.current.forEach((anim) => anim?.cancel());
    animsRef.current = [];

    const parado = pedido === 0 || semMovimento;

    fitas.forEach((fita, i) => {
      if (!fita) return;
      /* `- 2` e não `- 1`: a fita acaba numa vizinha que fica por baixo da
         janela, por isso a letra a parar ao centro é a penúltima. */
      const passos = fita.children.length - 2;
      const fim = centro - passos * celula;

      if (parado) {
        fita.style.transform = `translate3d(0, ${fim}px, 0)`;
        return;
      }

      fita.style.transform = `translate3d(0, ${centro}px, 0)`;
      const anim = fita.animate(
        [
          { transform: `translate3d(0, ${centro}px, 0)` },
          { transform: `translate3d(0, ${fim}px, 0)` },
        ],
        { duration: DUR_BASE + i * ESCALONAR, easing: CSS_SUAVIZACAO, fill: "forwards" },
      );
      /*
       * Fixar o fim no estilo e largar a animação. Com `fill: forwards` e sem
       * isto, cada giro deixa para trás uma animação viva a segurar o último
       * fotograma — ao fim de uma visita são centenas, todas por conta do
       * compositor.
       */
      anim.finished
        .then(() => {
          fita.style.transform = `translate3d(0, ${fim}px, 0)`;
          anim.cancel();
        })
        .catch(() => undefined);
      animsRef.current[i] = anim;
    });

    if (parado) {
      setAGirar(false);
      return;
    }

    if (comSomRef.current) {
      const passos = primeira.children.length - 2;
      const passagens: number[] = [];
      let anterior = -Infinity;
      for (let n = 1; n <= passos; n += 1) {
        const ms = tempoPara(n / passos) * DUR_BASE;
        /* Mais perto do que isto o ouvido não separa os estalidos: davam um
           zumbido, e dezenas de vozes juntas logo no arranque a saturar. */
        if (ms - anterior >= 18) {
          passagens.push(ms);
          anterior = ms;
        }
      }
      cortarSomRef.current?.();
      cortarSomRef.current = tocarGiro({
        passagens,
        travagens: fitas.map((_, i) => DUR_BASE + i * ESCALONAR),
      });
    }

    if (relogioRef.current) window.clearTimeout(relogioRef.current);
    relogioRef.current = window.setTimeout(() => setAGirar(false), TOTAL_GIRO + 60);
  }, [pedido, semMovimento]);

  /*
   * Giro automático: é a roleta a passear pelas competências sozinha.
   *
   * Um temporizador rearmado a cada giro, e não um intervalo fixo. Com o
   * intervalo havia este defeito: carregar em Girar não mexia no relógio, e
   * a roleta voltava a arrancar sozinha menos de dois segundos depois do
   * clique — parecia que o botão tinha disparado duas vezes. Como `pedido`
   * sobe em qualquer giro, seja do botão seja automático, a espera recomeça
   * sempre do fim do último.
   */
  useEffect(() => {
    if (!visivel || semMovimento) return;
    const id = window.setTimeout(
      () => girar(somLigadoRef.current && desbloqueadoRef.current),
      TOTAL_GIRO + PAUSA,
    );
    return () => window.clearTimeout(id);
  }, [visivel, semMovimento, girar, pedido]);

  /* As posições são em píxeis e a célula mede-se em vw — ao redimensionar,
     reassenta tudo onde estava, sem animar. */
  useEffect(() => {
    const reassentar = () => {
      if (animsRef.current.some((a) => a?.playState === "running")) return;
      const janela = janelaRef.current;
      const primeira = fitasRef.current[0];
      if (!janela || !primeira) return;
      const celula = (primeira.firstElementChild as HTMLElement | null)?.getBoundingClientRect()
        .height;
      if (!celula) return;
      const centro = (janela.getBoundingClientRect().height - celula) / 2;
      fitasRef.current.forEach((fita) => {
        if (!fita) return;
        fita.style.transform = `translate3d(0, ${centro - (fita.children.length - 2) * celula}px, 0)`;
      });
    };
    window.addEventListener("resize", reassentar);
    return () => window.removeEventListener("resize", reassentar);
  }, []);

  useEffect(
    () => () => {
      cortarSomRef.current?.();
      if (relogioRef.current) window.clearTimeout(relogioRef.current);
      animsRef.current.forEach((anim) => anim?.cancel());
    },
    [],
  );

  const aoGirar = () => {
    /* O motor de áudio só acorda dentro de um gesto — tem de ser aqui. */
    if (somLigadoRef.current) desbloqueadoRef.current = prepararSom();
    girar(somLigadoRef.current && desbloqueadoRef.current);
  };

  const alternarSom = () => {
    const ligado = !som;
    somLigadoRef.current = ligado;
    setSom(ligado);
    if (ligado) desbloqueadoRef.current = prepararSom();
    else cortarSomRef.current?.();
  };

  const total = String(PALAVRAS.length).padStart(3, "0");
  const atual = String(indice + 1).padStart(3, "0");

  return (
    <div ref={raizRef} className={`${styles.raiz} ${className}`.trim()}>
      <p className={styles.etiqueta}>
        No. {atual} / {total}
      </p>

      <div
        ref={janelaRef}
        className={styles.painel}
        data-girar={aGirar || undefined}
        role="img"
        aria-label={`Competência: ${PALAVRAS[indice]}`}
      >
        {tiras.map((tira, i) => (
          <div className={styles.coluna} key={i}>
            <div
              className={styles.fita}
              ref={(no) => {
                fitasRef.current[i] = no;
              }}
            >
              {tira.map((caracter, j) => (
                <span className={styles.car} key={j}>
                  {caracter === " " ? " " : caracter}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controlos}>
        {/*
          Sem `disabled` durante o giro, de propósito. Estando desativado
          enquanto roda, e rodando ela sozinha a cada poucos segundos, uma
          boa parte dos toques caía no vazio — e no telemóvel isso lê-se como
          botão avariado, não como botão ocupado. Tocar a meio corta o giro
          em curso e começa outro, que é o que se espera de um botão destes.
        */}
        <button type="button" className={styles.girar} onClick={aoGirar}>
          Girar
        </button>
        <button
          type="button"
          className={styles.somBotao}
          onClick={alternarSom}
          aria-pressed={som}
          data-ligado={som || undefined}
        >
          <span className={styles.pino} aria-hidden="true" />
          Som
        </button>
      </div>
    </div>
  );
}
