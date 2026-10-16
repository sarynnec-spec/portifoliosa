/**
 * Marcas das redes onde a gestão e os anúncios acontecem, nas CORES OFICIAIS.
 *
 * Desenhadas aqui em SVG, e não tiradas de `public/ferramentas/tec/`, porque
 * esse conjunto é de tecnologias (React, Postgres, …) e não tem nenhuma
 * destas três.
 *
 * As cores são as das marcas:
 *   Instagram — o degradé oficial, do amarelo ao azul passando pelo magenta
 *               e pelo roxo. É degradé e não cor chapada: a marca é assim
 *               desde 2016, e com uma cor só deixa de se reconhecer.
 *   Facebook  — #1877F2, o azul da marca.
 *   Meta      — #0081FB, o azul da marca.
 *
 * ⚠️ O Instagram e o Facebook são formas exactas — o quadrado de cantos
 * redondos com a lente e o ponto, e o «f» branco no círculo azul.
 * **O laço da Meta é aproximado**: o mark oficial tem espessura variável que
 * um traço de largura constante não dá. Está aqui para se ler a plataforma,
 * não para servir de ficheiro de marca. Com o SVG oficial da sala de imprensa
 * da Meta, troca-se por esse.
 */

type Props = { className?: string };

/*
 * O id do degradé é fixo. Chegam a existir dois destes em árvore ao mesmo
 * tempo, durante a troca de cliente no `AnimatePresence` — mas como os dois
 * degradés são iguais, a referência repetida resolve para o mesmo desenho e
 * não há diferença visível.
 */
const ID_GRADIENTE = "gradiente-instagram";

export function IconeInstagram({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={ID_GRADIENTE} x1="2" y1="22" x2="22" y2="2">
          <stop offset="0%" stopColor="#FFDC80" />
          <stop offset="20%" stopColor="#F77737" />
          <stop offset="40%" stopColor="#FD1D1D" />
          <stop offset="60%" stopColor="#E1306C" />
          <stop offset="80%" stopColor="#833AB4" />
          <stop offset="100%" stopColor="#405DE6" />
        </linearGradient>
      </defs>
      <rect
        x="2.2"
        y="2.2"
        width="19.6"
        height="19.6"
        rx="5.6"
        fill="none"
        stroke={`url(#${ID_GRADIENTE})`}
        strokeWidth="2.2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.4"
        fill="none"
        stroke={`url(#${ID_GRADIENTE})`}
        strokeWidth="2.2"
      />
      <circle cx="17.6" cy="6.4" r="1.45" fill={`url(#${ID_GRADIENTE})`} />
    </svg>
  );
}

export function IconeFacebook({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {/* Círculo e «f» em dois desenhos separados, e não num só caminho com
          vazado: assim o azul e o branco são explícitos e não dependem da
          regra de preenchimento. */}
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M16.671 15.543l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.643H7.078v3.47h3.047V24a12.09 12.09 0 0 0 3.75 0v-8.457h2.796z"
      />
    </svg>
  );
}

/*
 * TikTok: o mesmo desenho três vezes, deslocado — ciano atrás à esquerda,
 * vermelho atrás à direita, preto por cima. É assim que a marca é feita, e
 * é por isso que não se resolve com uma cor só.
 */
export function IconeTikTok({ className }: Props) {
  const nota =
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z";
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d={nota} fill="#25F4EE" transform="translate(-1.1 0.9)" />
      <path d={nota} fill="#FE2C55" transform="translate(1.1 -0.9)" />
      <path d={nota} fill="#000" />
    </svg>
  );
}

/* Google: o «G» nas quatro cores da marca, cada arco no seu caminho. */
export function IconeGoogle({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.86c2.26-2.09 3.56-5.17 3.56-8.87z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.7 0 3.99 2.47 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function IconeMeta({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="#0081FB"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.4 14.4c0-4.6 2.3-7.6 5-7.6 2.2 0 3.6 2.4 4.6 5.2 1-2.8 2.4-5.2 4.6-5.2 2.7 0 5 3 5 7.6 0 2.1-1.1 3.6-2.9 3.6-2.4 0-4-3.4-5.1-6.4h-3.2c-1.1 3-2.7 6.4-5.1 6.4-1.8 0-2.9-1.5-2.9-3.6Z"
      />
    </svg>
  );
}
