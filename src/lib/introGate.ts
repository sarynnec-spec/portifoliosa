"use client";

import { useEffect, useState } from "react";

/**
 * Decide uma única vez, ao carregar o módulo no browser, se a abertura toca.
 * O Hero espera por este portão para não gastar a sua entrada por trás da cortina.
 *
 * Não toca quando: o sistema pede menos movimento, ou a abertura já foi vista
 * nesta sessão. Força-se sempre com `?intro` no fim do endereço.
 */
function decide(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (new URLSearchParams(window.location.search).has("intro")) return true;
  try {
    return window.sessionStorage.getItem("intro-vista") !== "1";
  } catch {
    return true;
  }
}

export const introPlays = decide();

let done = !introPlays;
const listeners = new Set<() => void>();

export function markIntroDone() {
  if (done) return;
  done = true;
  try {
    window.sessionStorage.setItem("intro-vista", "1");
  } catch {
    /* modo privado — a abertura volta a tocar, e tudo bem */
  }
  listeners.forEach((l) => l());
}

/** `true` quando a página já pode animar por baixo da abertura. */
export function useIntroDone() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (done) {
      setReady(true);
      return;
    }
    const listener = () => setReady(true);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return ready;
}
