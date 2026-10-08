"use client";

/**
 * Som mecânico da roleta, sintetizado.
 *
 * Nada de ficheiros de áudio: além dos pedidos ao servidor, uma gravação de
 * roleta tem dono — e o problema maior é outro. O encanto do som é o ritmo:
 * os estalidos têm de abrandar exatamente ao ritmo a que as fitas abrandam.
 * Uma gravação tem o ritmo dela; aqui os tempos vêm da mesma curva de
 * desaceleração que move a imagem, por isso nunca se desencontram.
 *
 * O motor é emprestado por `introSom` — ver lá porque há só um.
 */

import { motorDeAudio } from "./introSom";

/**
 * Nunca acima disto, por muito que o volume do sistema esteja alto.
 *
 * Esteve em 0,42, e era esse o defeito que a deixava sem som no telemóvel.
 * Medido, rendendo o grafo inteiro num `OfflineAudioContext`: a versão antiga
 * dava pico −16,8 dBFS, RMS −37,1 e — o número que interessa — **−43,2 dBFS
 * acima dos 500 Hz**, que é a única banda que um altifalante de telemóvel
 * sabe dar. Num portátil ouvia-se; num telefone era silêncio.
 *
 * Com os valores de agora: pico −3,6 dBFS, RMS −25,4, **−27,2 na banda do
 * telemóvel** — 16 dB acima — e zero amostras a cortar.
 */
const VOLUME = 0.85;

/**
 * Banda e forma dos estalidos.
 *
 * O Q desceu de 1,6 para 0,7 e a banda de 3200–2100 Hz para 2500–1400: um
 * filtro mais aberto deixa passar mais energia por estalido, e mais abaixo
 * cai onde o altifalante de um telefone é melhor. O decaimento subiu de 30
 * para 45 ms — mais corpo, e continua a ler-se como estalido e não como nota.
 */
const Q_ESTALIDO = 0.7;
const DECAIMENTO = 0.045;
const FREQ_TOPO = 2500;
const FREQ_FUNDO = 1400;

let ruido: AudioBuffer | null = null;
let motorDoRuido: AudioContext | null = null;

function bufferDeRuido(ctx: AudioContext) {
  /* Reaproveitado entre giros; só se refaz se o motor for outro. */
  if (ruido && motorDoRuido === ctx) return ruido;
  const n = Math.floor(ctx.sampleRate * 0.08);
  const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < n; i += 1) dados[i] = Math.random() * 2 - 1;
  ruido = buffer;
  motorDoRuido = ctx;
  return buffer;
}

/**
 * Um estalido: ruído curto espremido por um passa-banda.
 *
 * É o ruído que dá o "tac" de peça a bater em peça. Um oscilador sozinho
 * soaria a apito; o ruído filtrado soa a plástico e metal.
 */
function estalido(
  ctx: AudioContext,
  saida: AudioNode,
  t: number,
  freq: number,
  ganho: number,
  decaimento: number,
) {
  const fonte = ctx.createBufferSource();
  fonte.buffer = bufferDeRuido(ctx);

  const filtro = ctx.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.frequency.setValueAtTime(freq, t);
  filtro.Q.value = Q_ESTALIDO;

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(ganho, t + 0.0012);
  env.gain.exponentialRampToValueAtTime(0.0001, t + decaimento);

  fonte.connect(filtro).connect(env).connect(saida);
  fonte.start(t);
  fonte.stop(t + decaimento + 0.02);
}

/** O baque de uma coluna a travar: o estalido mais grave, com corpo por baixo. */
function encaixe(ctx: AudioContext, saida: AudioNode, t: number) {
  estalido(ctx, saida, t, 1500, 0.8, 0.06);

  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  /*
   * 320 → 150 Hz, e não 190 → 95 como estava. O corpo do baque é o que lhe
   * dá peso, e a 95 Hz ele caía por baixo do que um altifalante de telemóvel
   * reproduz — o peso existia no sinal e não chegava ao ouvido de ninguém
   * que estivesse no telefone.
   */
  osc.frequency.setValueAtTime(320, t);
  /* Cai de tom enquanto morre — é o que soa a peça a assentar e não a nota. */
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.08);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.35, t + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
  osc.connect(env).connect(saida);
  osc.start(t);
  osc.stop(t + 0.14);
}

type Giro = {
  /** Instantes, em ms a contar do arranque, de cada letra que passa. */
  passagens: number[];
  /** Instantes, em ms, em que cada coluna trava. */
  travagens: number[];
};

/**
 * Agenda um giro inteiro de uma vez e devolve como o calar.
 *
 * Agendar tudo à cabeça, no relógio do motor, é o que mantém o som colado à
 * imagem: um `setTimeout` por estalido derrapava dezenas de milissegundos
 * assim que a página tivesse trabalho para fazer — e é precisamente durante
 * a animação que o tem.
 */
export function tocarGiro({ passagens, travagens }: Giro): () => void {
  const ctx = motorDeAudio();
  if (!ctx) return () => undefined;

  /* Dezenas de estalidos juntos saturam; o compressor segura os picos sem
     obrigar a baixar cada um a ponto de não se ouvir. */
  const limite = ctx.createDynamicsCompressor();
  limite.threshold.value = -16;
  limite.ratio.value = 10;
  limite.attack.value = 0.002;

  const saida = ctx.createGain();
  saida.gain.value = VOLUME;
  limite.connect(saida).connect(saidaDoMotor(ctx));

  /*
   * A imagem arranca no clique; o motor de áudio pode ainda levar uns
   * milissegundos a acordar. Descontar o tempo já decorrido é o que impede o
   * caso feio: o som a começar do princípio quando as fitas já vão a meio.
   */
  const inicio = performance.now();

  let agendado = false;

  const agendar = () => {
    if (agendado || ctx.state !== "running") return;
    agendado = true;

    /*
     * Não há travão de tempo aqui, e isso é a correção de um defeito real:
     * havia um `if (decorrido > 500) return`, e no telemóvel o motor demora
     * mais do que isso a acordar no primeiro toque — o giro saía sempre mudo.
     * O travão era redundante: o filtro abaixo já deita fora tudo o que já
     * passou, por isso um motor que acorde tarde toca só o que falta, em
     * sítio, e um que acorde depois do giro não toca nada.
     */
    const decorrido = performance.now() - inicio;
    const t0 = ctx.currentTime;

    passagens.forEach((ms, i) => {
      if (ms < decorrido) return;
      /* O tom desce um pouco à medida que abranda: não é física, é a mesma
         pista que o ouvido usa para perceber que uma coisa está a parar. */
      const avanco = i / Math.max(1, passagens.length - 1);
      estalido(
        ctx,
        limite,
        t0 + (ms - decorrido) / 1000,
        FREQ_TOPO - avanco * (FREQ_TOPO - FREQ_FUNDO),
        0.65,
        DECAIMENTO,
      );
    });

    travagens.forEach((ms) => {
      if (ms >= decorrido) encaixe(ctx, limite, t0 + (ms - decorrido) / 1000);
    });
  };

  /*
   * `resume()` dentro do gesto é o que o iOS exige — mas a promessa dele não
   * é de fiar em todo o lado: há browsers de telemóvel onde nunca resolve se
   * a saída de áudio demorar a abrir. Por isso, além da promessa, fica uma
   * sonda curta a espreitar o estado; o que chegar primeiro ganha, e
   * `agendado` impede que toque duas vezes. Mesmo padrão do `introSom`, que
   * já tinha pago esta lição.
   */
  agendar();
  if (!agendado) {
    void ctx.resume().then(agendar).catch(() => undefined);

    let voltas = 0;
    const sonda = window.setInterval(() => {
      agendar();
      /* Dois segundos e o motor não arrancou: desiste. A essa altura o giro
         já acabou e os estalidos não tinham onde cair. */
      if (agendado || (voltas += 1) > 50) window.clearInterval(sonda);
    }, 40);
  }

  return () => {
    const agora = ctx.currentTime;
    saida.gain.cancelScheduledValues(agora);
    saida.gain.setValueAtTime(saida.gain.value, agora);
    saida.gain.linearRampToValueAtTime(0.0001, agora + 0.08);
    window.setTimeout(() => {
      limite.disconnect();
      saida.disconnect();
    }, 200);
  };
}

function ehIPhone() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  /* O iPad moderno diz-se Mac; o que o denuncia é ter toque. */
  return /iPad|iPhone|iPod/.test(ua) || (/Mac/.test(ua) && navigator.maxTouchPoints > 1);
}

let destinoFinal: AudioNode | null = null;
/* O elemento fica guardado: solto, o recolector de lixo leva-o e leva a
   reprodução com ele. */
let altifalante: HTMLAudioElement | null = null;

/**
 * Para onde o som sai — e no iPhone isso **não** pode ser `ctx.destination`.
 *
 * No iPhone o WebAudio obedece ao interruptor de silêncio lateral: com o
 * telefone no silencioso, tudo o que saia por `ctx.destination` é mudo, e
 * nenhum truque de desbloqueio muda isso. O que o ignora é a reprodução de
 * média. Por isso aqui o som é desviado para um `MediaStreamDestination` e
 * esse fluxo vai tocar num `<audio>` — é áudio a sério, não um ficheiro de
 * silêncio a fingir, e é o próprio som da roleta que passa por lá.
 *
 * Isto substitui a tentativa anterior, que era tocar meio segundo de
 * silêncio num `<audio>` à parte para trocar a sessão. Ela não resolveu no
 * telefone dela, e tinha ainda o problema de o iPhone ser esquisito com
 * `data:` e `blob:` em elementos de média — agora não há URL nenhum.
 *
 * Fora do iPhone fica tudo como estava: um `<audio>` pelo meio só
 * acrescentaria latência e um sítio a mais para falhar.
 */
function saidaDoMotor(ctx: AudioContext): AudioNode {
  if (destinoFinal) return destinoFinal;

  if (!ehIPhone() || typeof ctx.createMediaStreamDestination !== "function") {
    destinoFinal = ctx.destination;
    return destinoFinal;
  }

  try {
    const destino = ctx.createMediaStreamDestination();
    const el = new Audio();
    el.srcObject = destino.stream;
    /* Por atributo e não por propriedade: `playsInline` só está tipado em
       `HTMLVideoElement`, e é no `<audio>` que o iPhone precisa dele. */
    el.setAttribute("playsinline", "");
    void el.play().catch(() => {
      /*
       * Não arrancou. Voltar à saída normal é melhor do que ficar mudo de
       * vez: com o interruptor desligado ouve-se na mesma, e com ele ligado
       * ficamos onde já estávamos.
       */
      destinoFinal = ctx.destination;
    });
    altifalante = el;
    destinoFinal = destino;
    return destinoFinal;
  } catch {
    destinoFinal = ctx.destination;
    return destinoFinal;
  }
}

/**
 * Acorda o motor dentro do gesto, antes de haver som para tocar.
 *
 * Três coisas, e nenhuma é opcional no telemóvel:
 *
 * 1. `resume()`, que é o que desbloqueia o motor;
 * 2. a saída de média montada **já**, dentro do toque — ver `saidaDoMotor`.
 *    O `play()` do `<audio>` tem de partir de um gesto, como qualquer outro;
 * 3. um nó mudo a tocar, também dentro do toque. No iPhone não chega pedir o
 *    `resume`: a saída de áudio só abre depois de alguma coisa ter tocado a
 *    sério, e tem de ser sem esperar por promessa nenhuma.
 */
export function prepararSom() {
  const ctx = motorDeAudio();
  if (!ctx) return false;

  if (ctx.state !== "running") void ctx.resume().catch(() => undefined);

  const destino = saidaDoMotor(ctx);

  try {
    const mudo = ctx.createBufferSource();
    mudo.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    mudo.connect(destino);
    mudo.start(0);
  } catch {
    /* Saída indisponível — o resto segue e não toca, sem rebentar. */
  }

  /* Se o elemento ficou em pausa (mudança de separador, por exemplo), um
     toque novo volta a pô-lo a andar — senão os giros seguintes saíam mudos
     sem razão visível. */
  if (altifalante && altifalante.paused) void altifalante.play().catch(() => undefined);

  return true;
}
