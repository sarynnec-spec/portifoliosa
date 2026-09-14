"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Buddy.module.css";

/**
 * A personagem do contacto, a ocupar a secção toda — o método do reel
 * "CURSOR TRACKING": o clip da cabeça a virar-se é *percorrido* com o rato,
 * não reproduzido.
 *
 * Três camadas, sempre no mesmo enquadramento:
 *   1. a imagem, que está sempre lá e nunca falha;
 *   2. o clip do olhar, percorrido com o rato;
 *   3. o clip da reação, que toca por cima quando o cursor chega aos contactos.
 *
 * Cada camada só aparece se o ficheiro dela existir. Assim a secção nunca fica
 * vazia à espera de um vídeo, e entra sozinha quando ele chegar.
 */

const IMAGEM = "/media/buddy/sapo.png";
const OLHAR = "/media/buddy/look.mp4";
const FELIZ = "/media/buddy/happy.mp4";

/** Quão depressa o vídeo persegue o alvo. Baixo = mais mole, mais vivo. */
const SUAVIDADE = 0.14;

/**
 * O troço do clip do olhar que se percorre, em segundos. Medido quadro a
 * quadro no clip real (189 quadros), não estimado.
 *
 * O Flow não fez o que se lhe pediu — em vez de mexer só a cabeça, ele **roda
 * o corpo todo**. Saiu melhor assim: lê-se muito mais do que um simples virar
 * de cabeça. O clip vai de frente (t≈0,3) até quase perfil esquerdo (t≈7,8),
 * de forma contínua e sem voltar atrás.
 *
 * A limitação: ele **nunca olha para a direita**. Metade do ecrã ficava só a
 * pô-lo de frente, e isso não se lê como seguir o rato.
 *
 * A saída é espelhar. O tempo do clip passa a ser a *distância ao centro* do
 * ecrã, e o vídeo vira ao contrário quando o rato passa para a direita:
 *   rato no meio  -> t≈0,3  -> de frente
 *   rato à esquerda -> t≈7,8 -> perfil, virado à esquerda
 *   rato à direita  -> t≈7,8 espelhado -> perfil, virado à direita
 * A troca do espelho acontece no centro, onde ele está de frente e portanto é
 * quase simétrico — é o único sítio do clip onde virar ao contrário não se vê.
 */
const INICIO = 0.3;
/**
 * Não se usa o clip até ao fim de propósito. Depois dos ~5,7 s ele fica de
 * perfil fechado e chega a virar as costas — e isso lê-se como *desviar* o
 * olhar, não como segui-lo. Travar aqui deixa-lhe sempre a cara à vista.
 */
const FIM = 5.6;

/**
 * Onde travar o clip da reação. Medido: os braços sobem logo no início e o V
 * fica no ar até aos ~2,5 s; depois descem (2,5–3,4 s), ele assenta as mãos
 * nos bolsos e aos ~5,2 s bate o pé.
 *
 * Entrar nos contactos toca do início até aqui e **fica**; sair daqui é que
 * larga o resto — descer os braços e bater o pé.
 */
const BRACOS_NO_AR = 2.5;

export default function Buddy({
  happy,
  onReacao,
}: {
  happy: boolean;
  /* O laranja em volta vive na secção, fora daqui, e tem de trocar de
     afinação ao mesmo tempo que o clip — os dois clips não têm o mesmo fundo. */
  onReacao?: (visivel: boolean) => void;
}) {
  const [semOlhar, setSemOlhar] = useState(false);
  const [semFeliz, setSemFeliz] = useState(false);
  /* A reação tem de continuar à vista depois de o rato sair, senão o gesto de
     baixar os braços e bater o pé toca por trás de uma camada transparente e
     ninguém o vê. Some só quando o clip acaba. */
  const [reacaoVisivel, setReacaoVisivel] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const video = useRef<HTMLVideoElement | null>(null);
  const reacao = useRef<HTMLVideoElement | null>(null);
  const jaEntrou = useRef(false);

  useEffect(() => {
    onReacao?.(reacaoVisivel);
  }, [reacaoVisivel, onReacao]);

  /* Percorrer o clip do olhar com o rato. */
  useEffect(() => {
    if (semOlhar) return;
    const el = root.current;
    const v = video.current;
    if (!el || !v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let alvo = 0.5; // 0 = extremo esquerdo do ecrã, 1 = extremo direito
    let atual = 0.5;
    let frame = 0;
    let visivel = false;
    let espelhado: boolean | null = null;

    const onMove = (event: PointerEvent) => {
      alvo = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
    };

    const desenha = () => {
      const dur = v.duration;
      if (dur && Number.isFinite(dur)) {
        atual += (alvo - atual) * SUAVIDADE;

        /* Espelhar só quando muda mesmo de lado — escrever no style a cada
           quadro obrigava o browser a recompor sem necessidade. */
        const querEspelho = atual > 0.5;
        if (querEspelho !== espelhado) {
          espelhado = querEspelho;
          /* Variável e não `transform`: a folha de estilo também escala a
             personagem, e escrever aqui o `transform` inteiro apagava-lhe o
             tamanho de cada vez que ele mudava de lado. */
          v.style.setProperty("--espelho", querEspelho ? "-1" : "1");
        }

        /* Distância ao centro: 0 no meio do ecrã, 1 em qualquer das bordas. */
        const d = Math.min(1, Math.abs(atual - 0.5) * 2);
        const t = INICIO + d * (Math.min(FIM, dur) - INICIO);
        /* Só procura se valer a pena: um seek por quadro por um décimo de
           milésimo engasga o descodificador. */
        if (Math.abs(v.currentTime - t) > 0.012) v.currentTime = t;
      }
      frame = requestAnimationFrame(desenha);
    };

    /* Só gasta quadros enquanto está no ecrã. */
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting === visivel) return;
        visivel = e.isIntersecting;
        if (visivel) {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(desenha);
        } else {
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(el);
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [semOlhar]);

  /* A reação, em duas metades: entrar levanta o polegar e segura-o; sair baixa
     a mão e bate o pé. */
  useEffect(() => {
    if (semFeliz) return;
    const v = reacao.current;
    if (!v) return;

    if (happy) {
      jaEntrou.current = true;
      setReacaoVisivel(true);
      v.currentTime = 0;
      void v.play().catch(() => undefined);
      /* Trava com os braços no ar até o rato sair. */
      let frame = 0;
      const vigia = () => {
        if (v.currentTime >= BRACOS_NO_AR) v.pause();
        else frame = window.requestAnimationFrame(vigia);
      };
      frame = window.requestAnimationFrame(vigia);
      return () => window.cancelAnimationFrame(frame);
    }

    /* Só termina o gesto se ele chegou a começar. */
    if (!jaEntrou.current) return;
    const acabou = () => setReacaoVisivel(false);
    v.addEventListener("ended", acabou, { once: true });
    void v.play().catch(() => setReacaoVisivel(false));
    return () => v.removeEventListener("ended", acabou);
  }, [happy, semFeliz]);

  return (
    <div
      ref={root}
      className={`${styles.root} ${reacaoVisivel ? styles.reagindo : ""}`.trim()}
      aria-hidden="true"
    >
      {/* Base: nunca falha, e é o mesmo enquadramento dos clips. */}
      <img className={styles.camada} src={IMAGEM} alt="" />

      {!semOlhar && (
        <video
          ref={video}
          className={styles.camada}
          src={OLHAR}
          muted
          playsInline
          preload="auto"
          onError={() => setSemOlhar(true)}
        />
      )}

      {!semFeliz && (
        <video
          ref={reacao}
          className={`${styles.camada} ${styles.reacao}`}
          src={FELIZ}
          muted
          playsInline
          preload="auto"
          onError={() => setSemFeliz(true)}
        />
      )}
    </div>
  );
}
