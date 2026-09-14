type Entry = {
  node: Element;
  reveal: () => void;
  /** Fração da altura da viewport abaixo da qual o topo do elemento dispara. */
  trigger: number;
};

const entries = new Set<Entry>();
let scheduled = false;
let listening = false;

/**
 * Registo único partilhado por todos os <Reveal>.
 *
 * Usa a posição do elemento em vez de transições de interseção: um scroll
 * rápido (ou um salto de âncora) pode passar por cima de um elemento sem que o
 * IntersectionObserver alguma vez o reporte como visível, deixando-o invisível
 * para sempre. Comparar o rect resolve isso e um só listener em rAF mantém o
 * custo baixo mesmo com dezenas de elementos.
 */
function check() {
  scheduled = false;
  const viewport = window.innerHeight;

  for (const entry of entries) {
    if (entry.node.getBoundingClientRect().top <= viewport * entry.trigger) {
      entry.reveal();
      entries.delete(entry);
    }
  }

  if (!entries.size) stopListening();
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(check);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

export function observeReveal(node: Element, reveal: () => void, trigger = 0.88) {
  const entry: Entry = { node, reveal, trigger };
  entries.add(entry);
  startListening();
  schedule();

  return () => {
    entries.delete(entry);
    if (!entries.size) stopListening();
  };
}
