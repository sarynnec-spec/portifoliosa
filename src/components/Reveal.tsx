"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { observeReveal } from "@/lib/revealRegistry";

type RevealProps = {
  children: ReactNode;
  /** Atraso em segundos, para escalonar elementos irmãos. */
  delay?: number;
  /** Fração da viewport que o topo do elemento tem de cruzar para revelar. */
  trigger?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Revela o conteúdo uma única vez, quando entra na viewport.
 * A animação vive em .reveal (globals.css) para não duplicar transições.
 */
export default function Reveal({
  children,
  delay = 0,
  trigger = 0.88,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return observeReveal(node, () => setVisible(true), trigger);
  }, [trigger]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      data-visible={visible || undefined}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
