"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import styles from "./Badge3D.module.css";

/*
 * Crachá suspenso por fita, com física de pêndulo amortecido.
 *
 *   θ'' = -(g / L)·sen θ − k·θ'
 *
 * Arrastar prende o crachá ao ponteiro e guarda a velocidade angular; ao
 * largar, ele continua o balanço e vai parando sozinho. Sem bibliotecas de
 * física: são duas linhas de integração por frame.
 */

const GRAVIDADE = 0.55;
const COMPRIMENTO = 1;
const AMORTECIMENTO = 1.6;
const IMPULSO_INICIAL = 2.2;

export default function Badge3D() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pivotRef = useRef<HTMLDivElement | null>(null);
  const cartaoRef = useRef<HTMLDivElement | null>(null);

  const angulo = useRef(-9);
  const velocidade = useRef(IMPULSO_INICIAL);
  const arrastar = useRef(false);
  const [ativo, setAtivo] = useState(false);

  const aplicar = useCallback(() => {
    const pivot = pivotRef.current;
    const cartao = cartaoRef.current;
    if (!pivot || !cartao) return;
    const a = angulo.current;
    pivot.style.transform = `rotate(${a.toFixed(2)}deg)`;
    /* A inclinação lateral acompanha a velocidade: dá volume ao movimento. */
    const giro = Math.max(-26, Math.min(26, velocidade.current * 7 + a * 0.5));
    cartao.style.transform = `rotateY(${giro.toFixed(2)}deg) rotateX(${(-a * 0.18).toFixed(2)}deg)`;
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      angulo.current = -4;
      velocidade.current = 0;
      aplicar();
      return;
    }

    let frame = 0;
    let anterior = performance.now();

    const passo = (agora: number) => {
      const dt = Math.min((agora - anterior) / 1000, 1 / 30);
      anterior = agora;

      if (!arrastar.current) {
        const rad = (angulo.current * Math.PI) / 180;
        const aceleracao =
          -(GRAVIDADE / COMPRIMENTO) * Math.sin(rad) * 60 - AMORTECIMENTO * velocidade.current;
        velocidade.current += aceleracao * dt;
        angulo.current += velocidade.current * dt * 60 * 0.35;
      }

      aplicar();
      frame = requestAnimationFrame(passo);
    };

    frame = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(frame);
  }, [aplicar]);

  /* Arrastar: o ângulo passa a ser o do ponteiro em relação ao ponto de suspensão. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let anguloAnterior = angulo.current;

    const anguloDoPonteiro = (event: PointerEvent) => {
      const caixa = stage.getBoundingClientRect();
      const px = caixa.left + caixa.width / 2;
      const py = caixa.top;
      const graus = (Math.atan2(event.clientX - px, event.clientY - py) * 180) / Math.PI;
      return Math.max(-62, Math.min(62, graus));
    };

    const mover = (event: PointerEvent) => {
      if (!arrastar.current) return;
      const novo = anguloDoPonteiro(event);
      velocidade.current = (novo - anguloAnterior) * 0.9;
      anguloAnterior = novo;
      angulo.current = novo;
    };

    const largar = () => {
      arrastar.current = false;
      setAtivo(false);
    };

    const agarrar = (event: PointerEvent) => {
      arrastar.current = true;
      setAtivo(true);
      anguloAnterior = anguloDoPonteiro(event);
      angulo.current = anguloAnterior;
      velocidade.current = 0;
    };

    stage.addEventListener("pointerdown", agarrar);
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", largar);
    window.addEventListener("pointercancel", largar);

    return () => {
      stage.removeEventListener("pointerdown", agarrar);
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", largar);
      window.removeEventListener("pointercancel", largar);
    };
  }, []);

  return (
    <div className={styles.stage} ref={stageRef} data-ativo={ativo || undefined}>
      <span className={styles.gancho} aria-hidden="true" />

      <div className={styles.pivot} ref={pivotRef}>
        <span className={styles.fita} aria-hidden="true">
          <span className={styles.fitaTexto}>MULTIMÉDIA · MULTIMÉDIA · MULTIMÉDIA</span>
        </span>
        <span className={styles.mola} aria-hidden="true" />

        <div className={styles.cartao} ref={cartaoRef}>
          <span className={styles.furo} aria-hidden="true" />

          <div className={styles.topo}>
            <img className={styles.foto} src={profile.portrait} alt="" loading="lazy" />
          </div>

          <p className={styles.nome}>{profile.fullName}</p>
          <p className={styles.cargo}>Técnica de Multimédia</p>

          <dl className={styles.campos}>
            <div>
              <dt>Área</dt>
              <dd>Design &amp; Multimédia</dd>
            </div>
            <div>
              <dt>Base</dt>
              <dd>{profile.location}</dd>
            </div>
            <div>
              <dt>Formação</dt>
              <dd>IEFP</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd className={styles.disponivel}>Disponível</dd>
            </div>
          </dl>

          <span className={styles.barras} aria-hidden="true" />
        </div>

        <p className={styles.dica} aria-hidden="true">
          Arrasta o crachá
        </p>
      </div>
    </div>
  );
}
