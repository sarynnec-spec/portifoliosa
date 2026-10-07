"use client";

/**
 * Som da abertura, sintetizado no browser.
 *
 * Sem ficheiros: os sons são simples — estalos, sopros e uma subida — e
 * fabricá-los em código evita três pedidos ao servidor, uma licença para
 * cada um, e o problema que estragaria tudo: um `<audio>` arranca quando o
 * browser lhe apetece, com dezenas de milissegundos de atraso variável.
 * Aqui agenda-se tudo de uma vez no relógio do próprio motor de áudio, que
 * é preciso ao nível da amostra — o som cai exatamente onde a imagem cai.
 *
 * Os tempos espelham os de Intro.module.css. Se lá mudarem, mudam aqui.
 */

/** Pastilhas de cor: a primeira e o intervalo entre letras, em segundos. */
const T_PASTILHA = 0.25;
const ST_PASTILHA = 0.055;

/** Colunas a desabrochar. */
const T_COLUNA = 1.35;
const ST_COLUNA = 0.05;
const D_COLUNA = 0.55;

/** Cortina a subir. */
const T_CORTINA = 2.45;
const D_CORTINA = 0.6;

/**
 * Escala pentatónica: sete estalos em intervalos quaisquer soariam a erro.
 * Nesta escala não há semitons, por isso qualquer sequência sai consonante —
 * é a razão de as caixas de música a usarem.
 */
const ESCALA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66];

/** Nunca acima disto, por muito que o volume do sistema esteja alto. */
const VOLUME = 0.52;

function bufferDeRuido(ctx: AudioContext, segundos: number) {
  const n = Math.floor(ctx.sampleRate * segundos);
  const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
  const dados = buffer.getChannelData(0);
  for (let i = 0; i < n; i += 1) dados[i] = Math.random() * 2 - 1;
  return buffer;
}

/** Estalo curto e afinado — uma pastilha a assentar. */
function estalo(ctx: AudioContext, saida: AudioNode, t: number, freq: number, ganho: number) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, t);
  /* Cai um pouco de tom enquanto morre: é o que faz soar a objeto a pousar
     em vez de a apito. */
  osc.frequency.exponentialRampToValueAtTime(freq * 0.84, t + 0.14);

  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(ganho, t + 0.006);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.17);

  osc.connect(env).connect(saida);
  osc.start(t);
  osc.stop(t + 0.22);
}

/** Sopro: ruído espremido por um filtro que varre para cima. */
function sopro(
  ctx: AudioContext,
  saida: AudioNode,
  ruido: AudioBuffer,
  t: number,
  dur: number,
  de: number,
  para: number,
  ganho: number,
) {
  const fonte = ctx.createBufferSource();
  fonte.buffer = ruido;

  const filtro = ctx.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.Q.value = 1.05;
  filtro.frequency.setValueAtTime(de, t);
  filtro.frequency.exponentialRampToValueAtTime(para, t + dur);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(ganho, t + dur * 0.3);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  fonte.connect(filtro).connect(env).connect(saida);
  fonte.start(t);
  fonte.stop(t + dur + 0.05);
}

/** A cortina a abrir: ruído a subir com uma nota por baixo a acompanhar. */
function subida(ctx: AudioContext, saida: AudioNode, ruido: AudioBuffer, t: number, dur: number) {
  const fonte = ctx.createBufferSource();
  fonte.buffer = ruido;

  const passaAlto = ctx.createBiquadFilter();
  passaAlto.type = "highpass";
  passaAlto.frequency.setValueAtTime(280, t);
  passaAlto.frequency.exponentialRampToValueAtTime(4200, t + dur);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.18, t + dur * 0.62);
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

  fonte.connect(passaAlto).connect(env).connect(saida);
  fonte.start(t);
  fonte.stop(t + dur + 0.05);

  /* Nota grave por baixo — dá corpo à subida e fecha a frase. */
  const osc = ctx.createOscillator();
  const envOsc = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(110, t);
  osc.frequency.exponentialRampToValueAtTime(440, t + dur * 0.8);
  envOsc.gain.setValueAtTime(0.0001, t);
  envOsc.gain.exponentialRampToValueAtTime(0.12, t + dur * 0.5);
  envOsc.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(envOsc).connect(saida);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/**
 * Um motor só, para a vida da página.
 *
 * Antes criava-se um por cada arranque, e era esse o defeito: da segunda vez
 * em diante o browser tem de voltar a adquirir a saída de áudio, o que demora
 * um tempo que varia. Como os sons são agendados a poucos centésimos do
 * relógio do motor, se o relógio ainda não tivesse arrancado os primeiros
 * ficavam agendados no passado — e um evento no passado é descartado em
 * silêncio, sem erro. Daí "à primeira ouve-se, depois não".
 *
 * Mantendo-o vivo, do segundo arranque em diante o relógio já anda e o
 * agendamento é sempre no futuro.
 */
let motor: AudioContext | null = null;
let ruidoCurto: AudioBuffer | null = null;
let ruidoLongo: AudioBuffer | null = null;

function arranjarMotor(): AudioContext | null {
  if (motor && motor.state !== "closed") return motor;

  const Motor: typeof AudioContext | undefined =
    typeof window === "undefined"
      ? undefined
      : window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!Motor) return null;

  motor = new Motor();
  ruidoCurto = bufferDeRuido(motor, 0.7);
  ruidoLongo = bufferDeRuido(motor, 1.2);

  /*
   * Desbloqueio do iPhone. No Safari não chega criar o motor dentro do toque:
   * a saída só se abre depois de um nó ter tocado mesmo, e tem de ser dentro
   * do gesto, sem esperar por promessa nenhuma. Um buffer de uma amostra em
   * silêncio serve — ninguém o ouve, e é o que abre a porta ao resto.
   */
  try {
    const mudo = motor.createBufferSource();
    mudo.buffer = motor.createBuffer(1, 1, motor.sampleRate);
    mudo.connect(motor.destination);
    mudo.start(0);
  } catch {
    /* Motor sem saída disponível — o resto segue e não toca, sem rebentar. */
  }

  return motor;
}

/**
 * O mesmo motor, para quem mais precise de som na página.
 *
 * Um browser só deixa ter um punhado de `AudioContext` abertos, e cada um
 * paga de novo a aquisição da saída — e as armadilhas acima (o relógio que
 * ainda não anda, o desbloqueio do iPhone) voltariam todas. Por isso há um
 * motor e emprestam-se nós, em vez de haver um motor por componente.
 */
export function motorDeAudio(): AudioContext | null {
  return arranjarMotor();
}

/**
 * Agenda a banda sonora e devolve uma forma de a calar — se a pessoa saltar
 * a abertura a meio, o som tem de ir atrás.
 *
 * `letras` é o número de pastilhas/colunas, para a música acompanhar o nome
 * em vez de assumir sete.
 */
export function tocarAbertura(letras: number, aoArrancar?: () => void): () => void {
  const ctx = arranjarMotor();

  /* Sem motor de áudio, a animação corre à mesma — em silêncio, mas corre. */
  if (!ctx || !ruidoCurto || !ruidoLongo) {
    aoArrancar?.();
    return () => undefined;
  }

  let cortar: () => void = () => undefined;
  let cancelado = false;

  const agendar = () => {
    if (cancelado || ctx.state !== "running") return;

    /* Sete sopros sobrepostos saturam depressa: o compressor segura os picos
       sem ter de baixar cada um a ponto de não se ouvir. */
    const limite = ctx.createDynamicsCompressor();
    limite.threshold.value = -14;
    limite.ratio.value = 8;
    limite.attack.value = 0.003;

    /* Ganho próprio de cada arranque: cortar este não mexe no motor, que
       continua vivo para o arranque seguinte. */
    const saida = ctx.createGain();
    saida.gain.value = VOLUME;
    limite.connect(saida).connect(ctx.destination);

    /*
     * Folga curta entre o agendamento e o primeiro som: dá tempo ao browser
     * de desenhar o primeiro fotograma da animação, que arranca no aviso
     * logo a seguir. É isto que põe os dois no mesmo instante.
     */
    const t0 = ctx.currentTime + 0.05;

    /*
     * O aviso sai daqui e não do toque. No telemóvel o motor pode demorar
     * décimos de segundo a acordar; arrancar a imagem no toque e o som só
     * quando o motor ficasse pronto era exatamente o desencontro que se via.
     */
    aoArrancar?.();

    for (let i = 0; i < letras; i += 1) {
      const nota = ESCALA[i % ESCALA.length] * (i >= ESCALA.length ? 2 : 1);
      estalo(ctx, limite, t0 + T_PASTILHA + ST_PASTILHA * i, nota, 0.24);
    }

    for (let i = 0; i < letras; i += 1) {
      /* Cada coluna sopra um pouco mais aguda do que a anterior, no mesmo
         sentido em que as cores sobem no arco-íris. */
      const de = 320 + i * 60;
      sopro(ctx, limite, ruidoCurto!, t0 + T_COLUNA + ST_COLUNA * i, D_COLUNA, de, de * 5.5, 0.085);
    }

    subida(ctx, limite, ruidoLongo!, t0 + T_CORTINA, D_CORTINA);

    cortar = () => {
      /* Desce em 120 ms em vez de cortar a seco, que daria um estalo. */
      const agora = ctx.currentTime;
      saida.gain.cancelScheduledValues(agora);
      saida.gain.setValueAtTime(saida.gain.value, agora);
      saida.gain.linearRampToValueAtTime(0.0001, agora + 0.12);
      window.setTimeout(() => {
        limite.disconnect();
        saida.disconnect();
      }, 250);
    };
  };

  /*
   * `resume()` pedido sempre e já, dentro do gesto — é o que o iOS exige.
   *
   * A promessa dele não é de fiar em todo o lado: há browsers onde nunca
   * resolve se a saída demorar. Por isso, além da promessa, fica uma sonda
   * curta a espreitar o estado. O que agendar primeiro ganha; `agendado`
   * impede que toque duas vezes.
   */
  let agendado = false;
  const tentar = () => {
    if (agendado || cancelado) return;
    if (ctx.state !== "running") return;
    agendado = true;
    agendar();
  };

  void ctx.resume().then(tentar).catch(() => undefined);
  tentar();

  if (!agendado) {
    let voltas = 0;
    const sonda = window.setInterval(() => {
      tentar();
      if (agendado || cancelado) {
        window.clearInterval(sonda);
        return;
      }
      /*
       * Meio segundo à espera e o motor não arrancou: desiste e deixa a
       * animação correr em silêncio. Prender a imagem a um som que nunca vem
       * seria transformar um botão que não toca num botão que não faz nada.
       */
      if ((voltas += 1) > 12) {
        window.clearInterval(sonda);
        aoArrancar?.();
      }
    }, 40);
  }

  return () => {
    cancelado = true;
    cortar();
  };
}
