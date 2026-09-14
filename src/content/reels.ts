/**
 * Secção de motion graphics — os vídeos verticais, reunidos num sítio só.
 *
 * As peças vinham misturadas com os sites e a identidade, na lista de
 * trabalho; quem procura motion tinha de as ir descobrindo pelo meio.
 *
 * Números medidos nos próprios ficheiros (duração, formato, fps) — nada aqui
 * é estimado.
 */

export type Reel = {
  slug: string;
  index: string;
  title: string;
  category: string;
  /** Linha curta de ficha técnica: duração, formato, onde vive. */
  ficha: string;
  description: string;
  highlights: string[];
  stack: string[];
  video: string;
  poster: string;
  alt: string;
};

export const reels: Reel[] = [
  {
    slug: "reel-apresentacao",
    index: "M1",
    title: "Reel de apresentação",
    category: "Motion Graphics · Cartão de visita em vídeo",
    ficha: "17 s · 1080×1920 · 30 fps",
    description:
      "O meu cartão de visita em movimento: os trabalhos entram a voar à volta do nome, a ideia fixa-se numa frase e o fecho é um convite ao contacto. Fundo branco e tipografia a fazer o trabalho todo — sem efeitos a mais a disputar a atenção.",
    highlights: [
      "Miniaturas dos trabalhos reais a orbitar o nome, cada uma com a sua entrada",
      "Passagem da grelha de trabalhos para o retrato, em círculo de luz",
      "Frase-manifesto construída palavra a palavra, com a ênfase a cair no fim",
      "Cartão final com nome, função e chamada ao contacto",
    ],
    stack: ["Remotion", "React", "Motion Graphics", "Edição de Vídeo"],
    video: "/media/web/reel-sarynne.mp4",
    poster: "/media/web/reel-sarynne-poster.jpg",
    alt: "Fotograma do reel de apresentação: retrato dentro de um círculo de luz",
  },
  {
    slug: "reel-portugal",
    index: "M2",
    title: "Portugal em 30s",
    category: "Motion Graphics · Reel para Redes Sociais",
    ficha: "30 s · 1080×1920 · Instagram e TikTok",
    description:
      "Reel vertical de viagem construído de raiz em código, com fotografia própria e música de licença livre — sem stock nem imagens de terceiros. Percorre Lisboa, Aveiro, a Praia da Barra e Águeda, com as instalações de rua que tornaram a cidade conhecida.",
    highlights: [
      "Transições próprias: persianas de cor, íris a fechar e mosaico animado",
      "Ken Burns alternado em 18 fotografias, com texto a entrar letra a letra",
      "Música alinhada por análise de energia da faixa: o pico cai nos cortes rápidos e a quebra no pôr do sol",
    ],
    stack: ["Remotion", "React", "Motion Graphics", "Edição de Vídeo"],
    video: "/media/web/reel-portugal.mp4",
    poster: "/media/web/reel-poster.jpg",
    alt: "Fotograma do reel: rua de Águeda coberta de guarda-chuvas coloridos",
  },
  {
    slug: "rafalice-anuncio",
    index: "M3",
    title: "Anúncio Salgados Rafalice",
    category: "Motion Graphics · Anúncio para Meta Ads",
    ficha: "15 s · 2160×3840 · entregue também em 1080×1920",
    description:
      "Anúncio vertical para Instagram e Facebook Ads, construído de raiz em código. Sete secções encadeadas — gancho, revelação do produto, sabores, oferta e chamada à ação — sobre um fundo de listras da marca que escurece por blocos consoante o que precisa de destaque.",
    highlights: [
      "Grelha 2×2 de azulejos que rodam para revelar cada sabor",
      "Legibilidade pelo contorno do próprio texto, sem escurecer o fundo",
      "Entrada da música escolhida por análise de energia da faixa: o ponto alto cai sobre os cartões de preço e o pico sobre o logótipo",
      "Fotograma exportado da mesma composição serve de imagem estática do conjunto de anúncios",
    ],
    stack: ["Remotion", "React", "Motion Graphics", "Meta Ads"],
    video: "/media/web/rafalice-anuncio.mp4",
    poster: "/media/web/rafalice-anuncio-poster.jpg",
    alt: "Fotograma do anúncio: três mãos a partilhar salgados sobre listras da marca",
  },
];
