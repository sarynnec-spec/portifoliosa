"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Roleta, { type Giro } from "./Roleta";
import styles from "./CantoServicos.module.css";

/**
 * O retrato e a roleta, lado a lado, com o fio a correr à volta da foto.
 *
 * Isto existe como componente de cliente porque a secção Serviços é de
 * servidor e não pode passar funções a um componente de cliente — e o fio
 * precisa de ser avisado pela roleta.
 */

/** Voltas que o fio dá à foto em cada giro. */
const VOLTAS = 3;

/** Que fração do perímetro o traço ocupa. */
const COMPRIMENTO = 0.17;

export default function CantoServicos() {
  const [caixa, setCaixa] = useState({ largura: 0, altura: 0 });
  const [semMovimento, setSemMovimento] = useState(false);

  const figuraRef = useRef<HTMLElement | null>(null);
  const fioRef = useRef<SVGRectElement | null>(null);
  const animRef = useRef<Animation | null>(null);
  const voltaRef = useRef(0);
  const semMovimentoRef = useRef(false);

  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => {
      semMovimentoRef.current = consulta.matches;
      setSemMovimento(consulta.matches);
    };
    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  /*
   * O SVG leva a caixa medida como `viewBox`, em vez de se esticar.
   *
   * Esticado com `preserveAspectRatio="none"`, o mesmo traço sairia mais
   * comprido nos lados do que no topo — a foto é bem mais alta do que larga,
   * e o fio dava a volta a mudar de tamanho. Medindo, o desenho é feito nas
   * unidades reais e o traço é o mesmo em todo o percurso.
   */
  useEffect(() => {
    const no = figuraRef.current;
    if (!no) return;
    const observador = new ResizeObserver(([entrada]) => {
      const r = entrada.contentRect;
      setCaixa({ largura: Math.round(r.width), altura: Math.round(r.height) });
    });
    observador.observe(no);
    return () => observador.disconnect();
  }, []);

  /*
   * O fio anda com os números que a roleta manda — a duração da última
   * coluna a travar e a mesma curva. Não há aqui constante nenhuma de tempo
   * a repetir a dela, por isso não há como os dois se desencontrarem.
   */
  const aoGirar = useCallback(({ duracao, suavizacao }: Giro) => {
    const fio = fioRef.current;
    if (!fio || semMovimentoRef.current) return;

    animRef.current?.cancel();

    const de = voltaRef.current;
    const para = de - VOLTAS;
    voltaRef.current = para;

    const anim = fio.animate(
      [{ strokeDashoffset: String(de) }, { strokeDashoffset: String(para) }],
      { duration: duracao, easing: suavizacao, fill: "forwards" },
    );
    /* Fixar o fim no estilo e largar a animação, como nas fitas: com
       `fill: forwards` acumulado, cada giro deixava uma animação viva. */
    anim.finished
      .then(() => {
        fio.style.strokeDashoffset = String(para);
        anim.cancel();
      })
      .catch(() => undefined);
    animRef.current = anim;
  }, []);

  useEffect(() => () => animRef.current?.cancel(), []);

  const { largura, altura } = caixa;

  return (
    <>
      {/*
        O mesmo ficheiro que a secção Sobre já usa, de propósito: a secção
        Sobre vem antes desta na página, por isso a imagem chega aqui da
        cache e não custa um único byte a mais.
      */}
      <figure className={styles.retrato} ref={figuraRef}>
        <img
          src="/media/me/sarynne.png"
          alt="Sarynne Ferreira, de perfil"
          width={1024}
          height={1536}
        />

        {largura > 0 && (
          <svg
            className={styles.fio}
            viewBox={`0 0 ${largura} ${altura}`}
            aria-hidden="true"
            focusable="false"
          >
            <rect
              ref={fioRef}
              className={styles.traco}
              x="1.5"
              y="1.5"
              width={Math.max(0, largura - 3)}
              height={Math.max(0, altura - 3)}
              rx="3"
              /*
               * `pathLength` a 1 põe o perímetro todo a valer 1, independente
               * do tamanho da foto: o traço é sempre a mesma fração da volta,
               * e um deslocamento de 1 é exatamente uma volta.
               */
              pathLength={1}
              strokeDasharray={`${COMPRIMENTO} ${1 - COMPRIMENTO}`}
              style={semMovimento ? undefined : { strokeDashoffset: voltaRef.current }}
            />
          </svg>
        )}
      </figure>

      <Roleta aoGirar={aoGirar} />
    </>
  );
}
