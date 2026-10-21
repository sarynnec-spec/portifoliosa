"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/content/projects";
import { reels } from "@/content/reels";
import styles from "./PulseArco.module.css";

/*
 * Os cinco movimentos do vídeo de referência (9tv6eg.mp4, 30 fps), lidos nos
 * fotogramas que guardei antes de o ficheiro sair dos Downloads:
 *
 *   1. DAR    — f0 a f12: os ecrãs chegam um a um e empilham-se em baralho.
 *   2. ABRIR  — f12 a f42: o baralho abre em leque até ao arco, que desce
 *               até junto da barra. É aqui que o contador chega a 100.
 *   3. ANEL   — f240 a f280: o arco FECHA-SE num anel inclinado e encolhido,
 *               visto de fora — mostra as laterais.
 *   4. ENTRAR — f280 a f320: a câmara cai para DENTRO do anel.
 *   5. CORRER — f320 em diante: o carrossel corre à volta de quem vê.
 *
 *   f72 (2,40 s) — o branco dá lugar às nuvens.
 *
 * Mudar um destes números desencontra a contagem do leque, que é a sincronia
 * que ela pediu.
 */
const DAR = 600;
const ABRIR = 1600;
/*
 * 🔴 As nuvens entravam aos 2,4s, ainda com o arco a abrir — e ela apanhou:
 * na referência o fundo AINDA É BRANCO no f240 e no f260, com o anel já
 * formado e a rodar. Só no f280 é que as nuvens aparecem, meio segundo antes
 * de a câmara entrar.
 *
 * Daí 3400: depois de o anel rodar (ANEL = 2400) e mesmo antes de ENTRAR
 * (3900). A legenda segue o mesmo princípio — na referência o texto só se lê
 * com o carrossel já a correr.
 */
const NUVENS = 3400;
const LEGENDA = 5600;
/*
 * 4.º e 5.º movimentos, lidos nos fotogramas 220 a 340 da referência:
 *   f220→f280 (2,0 s) — o arco fecha-se num anel inclinado
 *   f280→f320 (1,3 s) — a câmara ENTRA dentro do anel (o «zoom» que ela diz)
 *   f320 em diante    — abre num carrossel que corre à volta de quem vê
 */
/*
 * 🔴 Faltava-me o 3.º: entre o arco e o carrossel, a referência FECHA o arco
 * num anel inclinado e ENCOLHIDO, visto de fora — é o que ela descreve como
 * «dá uma pequena diminuída mostrando as laterais». Está nos f240 a f280.
 */
const ANEL = 2400;
const ENTRAR = 3900;
const CORRER = 5300;
/* Quanto tempo o carrossel corre antes de a volta recomeçar do princípio. */
const VOLTAR = 12800;

/*
 * Quanto tempo o scroll fica travado.
 *
 * 🔴 Era até CORRER (5300) e prendia cedo de mais: a secção mal tinha
 * entrado no ecrã, ainda não se via nada, e já estava travada. Ela pediu
 * «uma leve travada» e que desse para VER os movimentos — daí duas mudanças:
 * trava mais tarde (só quando a peça está mesmo à vista, ver o limiar do
 * observador) e durante menos tempo.
 */
const TRAVAO = 3400;

/*
 * Quanto da secção tem de estar à vista para a animação arrancar.
 *
 * Eram 20% — arrancava (e travava) com a secção a espreitar pela aresta de
 * baixo, e os primeiros movimentos passavam fora do ecrã. A 55% a peça já
 * está lá, e é isso que ela quer ver.
 */
const ENTRADA = 0.55;

/**
 * Abertura do leque.
 *
 * 250° é o que põe as pontas a apontar para baixo, até junto da barra do
 * fim, e foi ela que pediu que subisse de 230° — mais espaçamento entre
 * mocaps.
 */
const ABERTURA = 250;

/**
 * O que vai dentro do arco.
 *
 * ⚠️ Antes eram os 9 ecrãs do PULSE REPETIDOS duas vezes, porque nove não
 * chegavam para encher a volta. Ela mandou acabar com a repetição e pôr lá
 * os vídeos, as peças de motion e os sites — e há material de sobra:
 *
 *   9  ecrãs do PULSE          (/media/pulse/*.jpg)
 *   7  cartazes das peças de motion (os do `reels.ts`)
 *   7  sites dela em TELEMÓVEL (/media/pulse/sites/*.webp)
 *  ──
 *  23 cartões, todos diferentes.
 *
 * 🔴 Os sites são capturas REAIS a 390×844, tiradas aos sites no ar — não
 * são as capas de computador recortadas. As capas que o projeto já tinha
 * são todas deitadas (1440×639, 1280×854, …): metidas num ecrã de telemóvel
 * sobrava uma nesga do meio. Ela pediu «os sites no mocap celular», e um
 * site em telemóvel é o site visto em telemóvel.
 *
 * ⚠️ TODOS no mesmo formato de telemóvel, a pedido dela. Os cartazes 9/16
 * levam um recorte pequeno nas pontas (object-fit: cover) para caberem na
 * mesma forma — misturar proporções fazia o leque parecer desalinhado.
 */
type Cartao = { src: string; alt: string };

const pulse = projects.find((p) => p.slug === "pulse")!;

const ecransPulse: Cartao[] = (pulse.gallery ?? []).map((g) => ({
  src: g.src,
  alt: g.alt,
}));

/*
 * 🔴 Só entram as peças em pé, de telemóvel.
 *
 * As do `reels.ts` marcadas "4/5" — a Midea e a Teka — ficam de fora: ao
 * lado de ecrãs de telemóvel liam-se como um erro, e foi a Midea que ela
 * apontou. Não é uma lista escrita à mão: é o campo `ratio` a decidir, por
 * isso qualquer peça nova entra ou sai sozinha conforme o formato.
 */
/*
 * 🔴 O cartaz do reel de apresentação não serve PARA AQUI.
 *
 * Medido: 99,6% dos píxeis dele são brancos, com desvio de 5,5 — é o
 * primeiro fotograma do vídeo, que abre em branco. Como cartaz do <video>
 * na secção Motion está certo (é mesmo assim que a peça começa), mas no
 * meio da roda lia-se como um telemóvel apagado, e ela apanhou-o duas vezes.
 *
 * Em vez disso vai um fotograma com imagem, tirado do próprio vídeo aos
 * 9,0s — o ponto onde a peça tem mais tinta e menos branco de toda a sua
 * duração (varri-a de meio em meio segundo).
 *
 * ⚠️ O quadro inteiro desse segundo ainda era 70,8% branco e ela voltou a
 * apanhá-lo. A peça passa-se sobre branco, por isso nenhum fotograma dela
 * serve inteiro: o que serve é o RECORTE na foto, que localizei medindo
 * onde está a tinta (y 577..1426, x 239..840 do original).
 *
 * O cartaz original fica onde estava; isto é um ficheiro à parte.
 */
const CARTAZ_PROPRIO: Record<string, string> = {
  "reel-apresentacao": "/media/pulse/reel-sarynne.webp",
};

const pecasMotion: Cartao[] = reels
  .filter((r) => r.ratio !== "4/5")
  .map((r) => ({
    src: CARTAZ_PROPRIO[r.slug] ?? r.poster,
    alt: `${r.title} — ${r.category}`,
  }));

/* As capturas e o nome do site a que pertencem, para a alternativa textual. */
const SITES: [string, string][] = [
  ["autoshop", "AutoShop — stand automóvel"],
  ["eco-sem-fio", "Eco Sem Fio — internet segura"],
  ["lode", "LODÊ — atelier de cabelo"],
  ["sofia-sales", "Sofia Sales Clinic — estética"],
  /*
   * 🔴 Saíram TRÊS cartões desta família, e é a mesma família de propósito:
   * o Ondelle, a versão portuguesa dele e o BENESSERE são o mesmo molde,
   * com a mesma fotografia do ADN. Ela pediu o Ondelle fora e continuou a
   * vê-lo — era o Benessere, que lhe é igual aos olhos. Medidos: 175,7 /
   * 175,7 / 176,2 de brilho, todos claros no meio de ecrãs escuros.
   */
  /*
   * 🔴 O «ondelle-pt» saiu. Era o mesmo desenho do Ondelle (a versão
   * portuguesa do mesmo site), e para não ficarem dois cartões iguais
   * apanhei-o rolado — foi parar a uma zona BRANCA da página, que no meio
   * dos ecrãs escuros se lia como um cartão em branco. Ela apanhou-o. Um
   * site que só se distingue por rolar não dá cartão.
   */
];

const sitesTelemovel: Cartao[] = SITES.map(([f, nome]) => ({
  src: `/media/pulse/sites/${f}.webp`,
  alt: `${nome}, visto no telemóvel`,
}));

/*
 * Quantas vezes o conjunto dá a volta.
 *
 * As peças em pé que ela tem dão 21 cartões — e 21 não enchem a roda com o
 * tamanho que ela pediu. Ela mandou gerar volume e repetir se preciso, por
 * isso o conjunto entra DUAS vezes: 42 cartões, e o leque fecha-se numa
 * banda cheia em vez de uma fila de contas.
 *
 * Repetir não inventa trabalho nenhum: são as mesmas peças, outra vez.
 */
const VOLTAS = 2;

const conjunto: Cartao[] = [...ecransPulse, ...pecasMotion, ...sitesTelemovel];
const ecrans: Cartao[] = Array.from({ length: VOLTAS }, () => conjunto).flat();

type Fase = "espera" | "dar" | "abrir" | "anel" | "entrar" | "correr";

export default function PulseArco() {
  const ref = useRef<HTMLElement | null>(null);
  const [fase, setFase] = useState<Fase>("espera");
  const [conta, setConta] = useState(0);
  const [ceu, setCeu] = useState(false);
  const [legenda, setLegenda] = useState(false);
  /*
   * 🔴 O arranque é um contador de voltas e NÃO a própria `fase`.
   *
   * Com os temporizadores num efeito que dependia de `fase`, a primeira
   * mudança de fase corria a limpeza do efeito e CANCELAVA os temporizadores
   * seguintes: o arco ficava preso em «abrir», o contador congelava a 37% e
   * as nuvens e a legenda nunca chegavam. Medido, não suposto.
   *
   * Sendo um número que sobe a cada nova volta, o efeito corre uma vez por
   * volta e os quatro tempos ficam armados até ao fim dessa volta.
   */
  const [volta, setVolta] = useState(0);
  const relogios = useRef<ReturnType<typeof setTimeout>[]>([]);
  /* O travão do scroll só morde uma vez por carregamento — ver `travar`. */
  const jaTravou = useRef(false);

  /*
   * Trava o scroll enquanto os movimentos passam, a pedido dela.
   *
   * ⚠️ Isto tira o controlo a quem está a ler, e é das coisas que mais
   * irrita num site. Fica com quatro saídas, todas necessárias:
   *
   *   1. SÓ UMA VEZ por carregamento. A animação repete-se em ciclo e
   *      rearma-se ao voltar à secção — travar de cada vez prendia a pessoa
   *      sempre que passasse por aqui.
   *   2. Solta-se sozinho a meio dos movimentos — uma travada LEVE, não até
   *      ao fim. Ver `TRAVAO`.
   *   3. Solta-se à PRIMEIRA tecla, roda do rato ou gesto — quem quer passar,
   *      passa. O travão existe para quem não reagiu, não para prender.
   *   4. Rede de segurança: solta-se de qualquer maneira meio segundo depois,
   *      mesmo que algo acima falhe. Ninguém fica preso numa página.
   *
   * Quem pediu menos movimento no sistema nunca é travado.
   */
  const travar = (ms: number) => {
    if (jaTravou.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    jaTravou.current = true;

    const lenis = window.__lenis;
    const html = document.documentElement;
    let solto = false;
    let ouvir: ReturnType<typeof setTimeout>;
    const soltar = () => {
      if (solto) return;
      solto = true;
      clearTimeout(ouvir);
      lenis?.start();
      html.style.overflow = "";
      window.removeEventListener("wheel", soltar);
      window.removeEventListener("touchstart", soltar);
      window.removeEventListener("keydown", soltar);
    };

    lenis?.stop();
    /* O `overflow` apanha o caso de o Lenis não estar lá (ex.: reduced
       motion desligou-o noutro separador) — sem isto, nada travava. */
    html.style.overflow = "hidden";

    /*
     * 🔴 As saídas por gesto só começam a ouvir 700ms depois.
     *
     * Medido: sem esta espera o travão durava ~150ms. Quem chega aqui chega
     * A ROLAR, e o próprio gesto que trouxe a pessoa à secção — com a
     * inércia que lhe vem atrás — disparava logo o `wheel` e soltava tudo.
     * A espera deixa esse gesto acabar; o seguinte já é uma decisão.
     */
    ouvir = setTimeout(() => {
      if (solto) return;
      window.addEventListener("wheel", soltar, { passive: true });
      window.addEventListener("touchstart", soltar, { passive: true });
      window.addEventListener("keydown", soltar);
    }, 700);
    relogios.current.push(ouvir);
    relogios.current.push(setTimeout(soltar, ms));
    relogios.current.push(setTimeout(soltar, ms + 500));
  };

  /*
   * Arranca quando a secção entra no ecrã e REFAZ-SE sempre que ela sai e
   * volta — pedido dela.
   *
   * Os dois limiares não são o mesmo de propósito: entra com a secção já
   * bem à vista (`ENTRADA`), mas só se rearma quando ela sai por COMPLETO
   * (rácio 0). Com um limiar só, uma rolagem a tremer junto à fronteira
   * reiniciava a animação vezes sem conta.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFase("correr");
      setConta(100);
      setCeu(true);
      setLegenda(true);
      return;
    }
    let dentro = false;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!dentro && e.intersectionRatio >= ENTRADA) {
          dentro = true;
          setVolta((v) => v + 1);
          travar(TRAVAO);
        } else if (dentro && e.intersectionRatio === 0) {
          dentro = false;
          /* Os relógios da volta anterior têm de morrer aqui: fora do ecrã
             continuavam a disparar e deixavam a secção meio montada. */
          relogios.current.forEach(clearTimeout);
          relogios.current = [];
          window.__lenis?.start();
          document.documentElement.style.overflow = "";
          setFase("espera");
          setConta(0);
          setCeu(false);
          setLegenda(false);
        }
      },
      { threshold: [0, ENTRADA] },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      relogios.current.forEach(clearTimeout);
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, []);

  /* Os três movimentos, um a seguir ao outro, nos tempos lidos na referência. */
  useEffect(() => {
    if (volta === 0) return;
    setFase("dar");
    setConta(0);
    setCeu(false);
    setLegenda(false);
    relogios.current = [
      setTimeout(() => setFase("abrir"), DAR),
      setTimeout(() => setCeu(true), NUVENS),
      setTimeout(() => setLegenda(true), LEGENDA),
      setTimeout(() => setFase("anel"), ANEL),
      setTimeout(() => setFase("entrar"), ENTRAR),
      setTimeout(() => setFase("correr"), CORRER),
      /* Em ciclo: volta ao princípio e refaz os cinco movimentos, sem ser
         preciso sair e voltar ao ecrã. */
      setTimeout(() => setVolta((v) => v + 1), VOLTAR),
    ];
    const meus = relogios.current;
    return () => meus.forEach(clearTimeout);
  }, [volta]);

  /* O contador sobe do princípio do baralho até o leque estar aberto. */
  useEffect(() => {
    if (volta === 0) return;
    const inicio = performance.now();
    let frame = 0;
    const passo = () => {
      const t = Math.min((performance.now() - inicio) / ABRIR, 1);
      setConta(Math.round(t * 100));
      if (t < 1) frame = requestAnimationFrame(passo);
    };
    frame = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(frame);
  }, [volta]);

  const meio = (ecrans.length - 1) / 2;

  return (
    <section className={styles.seccao} ref={ref} data-fase={fase} aria-labelledby="pulse-arco-titulo">
      {/* As nuvens entram depois de a contagem acabar, como na referência. */}
      <div className={styles.ceu} data-ligado={ceu || undefined} aria-hidden="true" />

      <div className={styles.palco}>
        <div className={styles.roda}>
          {ecrans.map((e, i) => (
            <figure
              key={`${e.src}-${i}`}
              className={styles.carta}
              style={
                {
                  "--a": `${-ABERTURA / 2 + (i * ABERTURA) / (ecrans.length - 1)}deg`,
                  /* A DAR, chegam por ordem, um a um, como quem dá cartas. */
                  "--dar": `${i * (DAR / ecrans.length)}ms`,
                  /* A ABRIR, o leque parte do meio para fora. */
                  "--abrir": `${Math.abs(i - meio) * 55}ms`,
                  /* No carrossel os cartões repartem-se pela volta inteira. */
                  "--anel": `${(i * 360) / ecrans.length}deg`,
                } as React.CSSProperties
              }
            >
              {/* Só a primeira volta é que se anuncia: na segunda as peças
                  repetem-se, e um leitor dizia 42 nomes para 21 peças. */}
              <img
                src={e.src}
                alt={i < conjunto.length ? e.alt : ""}
                aria-hidden={i < conjunto.length ? undefined : true}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>

      <p className={styles.contador} aria-hidden="true">
        {String(conta).padStart(3, "0")}
        <span>%</span>
      </p>

      {/*
        🔴 Dizia «PULSE · UX/UI Design · App de ginásio» e mandava para o
        trabalho. Já não serve: a roda deixou de ser só o PULSE — leva os
        ecrãs da app, os cartazes das peças de motion e os sites dela em
        telemóvel. O texto passou a falar de PROJETOS e a seta vai para o
        MOTION, que é o que ela pediu.
      */}
      <div className={`container ${styles.legenda}`} data-entrou={legenda || undefined}>
        <h2 id="pulse-arco-titulo">Projetos</h2>
        <p className={styles.categoria}>
          Apps · Sites · Motion Graphics
        </p>
        <a className={styles.link} href="#motion">
          Ver as peças de motion
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
