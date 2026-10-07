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

/** Nunca acima disto, por muito que o volume do sistema esteja alto. */
const VOLUME = 0.42;

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
  filtro.Q.value = 1.6;

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
  estalido(ctx, saida, t, 1500, 0.5, 0.055);

  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(190, t);
  /* Cai de tom enquanto morre — é o que soa a peça a assentar e não a nota. */
  osc.frequency.exponentialRampToValueAtTime(95, t + 0.08);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.22, t + 0.004);
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
  limite.connect(saida).connect(ctx.destination);

  /*
   * A imagem arranca no clique; o motor de áudio pode ainda levar uns
   * milissegundos a acordar. Descontar o tempo já decorrido é o que impede o
   * caso feio: o som a começar do princípio quando as fitas já vão a meio.
   */
  const inicio = performance.now();

  const agendar = () => {
    if (ctx.state !== "running") return;

    const decorrido = performance.now() - inicio;
    /* Meio segundo à espera do motor e já ninguém liga os estalidos à
       imagem — mais vale o giro sair mudo do que sair fora de sítio. */
    if (decorrido > 500) return;

    const t0 = ctx.currentTime;

    passagens.forEach((ms, i) => {
      if (ms < decorrido) return;
      /* O tom desce um pouco à medida que abranda: não é física, é a mesma
         pista que o ouvido usa para perceber que uma coisa está a parar. */
      const avanco = i / Math.max(1, passagens.length - 1);
      estalido(ctx, limite, t0 + (ms - decorrido) / 1000, 3200 - avanco * 1100, 0.3, 0.03);
    });

    travagens.forEach((ms) => {
      if (ms >= decorrido) encaixe(ctx, limite, t0 + (ms - decorrido) / 1000);
    });
  };

  /* `resume()` dentro do gesto é o que o iOS exige; se o motor ainda não
     anda, o agendamento cairia no passado e sumia em silêncio. */
  if (ctx.state === "running") agendar();
  else void ctx.resume().then(agendar).catch(() => undefined);

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

/** Acorda o motor dentro do gesto, antes de haver som para tocar. */
export function prepararSom() {
  const ctx = motorDeAudio();
  if (ctx && ctx.state !== "running") void ctx.resume().catch(() => undefined);
  return !!ctx;
}
