"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AnimacaoCanto.module.css";

/**
 * A faixa animada no canto da secção Motion.
 *
 * A frase entra no fim de cada volta, no mesmo sítio e no mesmo momento em
 * que o original escrevia o texto que foi retirado — e entra a escrever-se,
 * letra a letra, como ele fazia. Mudar a frase mexe-se aqui e em mais lado
 * nenhum.
 */
const FRASE = "Onde o design encontra a tecnologia.";

/** Segundos, antes do fim da volta, em que a frase começa a escrever-se. */
const ANTECIPACAO = 4;

/**
 * Até que segundo da volta a porta fica aberta.
 *
 * Medido no vídeo: as personagens entram pela margem direita nos primeiros
 * segundos e já vão todas lá dentro por volta dos cinco. A porta abre com
 * elas e fecha-se quando a última passa.
 */
const PORTA_ABERTA_ATE = 5.2;

/** Intervalo entre letras, em segundos. */
const PASSO = 0.042;

export default function AnimacaoCanto() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [visivel, setVisivel] = useState(false);
  const [aberta, setAberta] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    /*
     * Lido do próprio vídeo e não de uma constante com a duração: se um dia
     * o ficheiro for trocado por outro mais curto ou mais longo, a frase
     * continua a cair no fim da volta sem ninguém ir lá acertar.
     */
    const olhar = () => {
      const fim = v.duration;
      if (!Number.isFinite(fim)) return;
      setVisivel(v.currentTime >= fim - ANTECIPACAO);
      setAberta(v.currentTime < PORTA_ABERTA_ATE);
    };

    v.addEventListener("timeupdate", olhar);
    /* No reinício da volta o `timeupdate` pode demorar um instante a chegar,
       e a frase ficava pendurada no arranque da volta seguinte. */
    v.addEventListener("seeked", olhar);
    return () => {
      v.removeEventListener("timeupdate", olhar);
      v.removeEventListener("seeked", olhar);
    };
  }, []);

  return (
    <div className={styles.caixa}>
      <video
        ref={videoRef}
        className={styles.filme}
        src="/media/web/motion-canto.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/*
        Cada letra no seu `<span>`, com o atraso próprio, e não um corte
        progressivo da frase: cortada, a última palavra saltava de linha
        quando passasse a caber, e a frase dançava enquanto se escrevia.
        Assim o texto ocupa desde o início o espaço que vai ocupar, e só a
        tinta é que chega.

        O `aria-label` guarda a frase inteira — sem ele um leitor de ecrã
        anunciava trinta e cinco letras avulsas.
      */}
      {/*
        A porta.

        Sem ela, as personagens entram pela margem direita e, com o fundo
        todo branco, leem-se como cortadas em vez de a chegar. Com a porta
        ali, a mesma imagem passa a ler-se como alguém a entrar.

        A folha roda mesmo em 3D (`rotateY` sobre a dobradiça, com
        `perspective` no aro), e não é um desenho a fingir a abertura: em
        perspetiva verdadeira a aresta de fora encurta sozinha e os ângulos
        batem certo em qualquer tamanho. Abre quando elas entram e fecha
        depois de passarem — ver `aberta`, acima.
      */}
      <span className={styles.porta} data-aberta={aberta || undefined} aria-hidden="true">
        <span className={styles.vao} />
        <span className={styles.folha}>
          <span className={styles.puxador} />
        </span>
        <span className={styles.aro} />
        <span className={styles.soleira} />
      </span>

      <p className={styles.frase} data-visivel={visivel || undefined} aria-label={FRASE}>
        {[...FRASE].map((letra, i) => (
          <span key={i} aria-hidden="true" style={{ transitionDelay: `${i * PASSO}s` }}>
            {letra === " " ? " " : letra}
          </span>
        ))}
      </p>
    </div>
  );
}
