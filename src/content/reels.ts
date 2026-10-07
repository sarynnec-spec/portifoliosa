/**
 * Secção de motion graphics — os vídeos verticais, reunidos num sítio só.
 *
 * As peças vinham misturadas com os sites e a identidade, na lista de
 * trabalho; quem procura motion tinha de as ir descobrindo pelo meio.
 *
 * Deixaram de estar umas por baixo das outras: agora passam num carrossel,
 * uma de cada vez. A ordem é escolhida — as peças de marca abrem a secção.
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
  /**
   * Proporção real do ficheiro. O ecrã do aparelho toma esta forma: assim a
   * imagem enche de aresta a aresta e não se corta nada. Num ecrã 9:16 fixo,
   * um 4:5 ou sobrava em faixas (que se leem como corte) ou perdia 30% da
   * largura.
   */
  ratio: "9/16" | "4/5";
  /**
   * Falso quando o ficheiro publicado não leva áudio — aí nem sequer se
   * mostra o botão de som.
   */
  temSom?: boolean;
};

export const reels: Reel[] = [
  {
    slug: "midea-motion",
    index: "M1",
    title: "Midea",
    category: "Motion Graphics · Peça de marca",
    ficha: "15,7 s · 1080×1350 · 30 fps",
    description:
      "Uma peça inteira construída à volta de um só gesto: o giro nunca se perde. Entra a girar, assenta no logótipo, volta a girar — e é desse giro que nasce a roda de eletrodomésticos, que roda para trazer cada produto ao topo, amplia e vira produto real. Fecha em azul sobre branco com o cartão «Simply ideal».",
    highlights: [
      "Entrada oficial da marca medida fotograma a fotograma: o arco varre 496,1° em 14 frames enquanto o nome fica a direito",
      "Logótipo recortado da arte oficial, nunca redesenhado — IoU 0,8805 contra o ficheiro da marca, com o rácio a 0,21%",
      "O anel trava nos 11,62°/frame: acima disso os treze ícones leem-se a rodar ao contrário, como a roda de carroça",
      "Cada movimento entrega o seguinte — a saída de um gesto é a entrada do outro, sem nada a aparecer por si",
    ],
    stack: ["Remotion", "React", "SVG", "Motion Graphics"],
    video: "/media/web/midea-motion.mp4",
    poster: "/media/web/midea-motion-poster.jpg",
    alt: "Fotograma da peça Midea: anel de treze ícones de eletrodomésticos sob o logótipo da marca",
    ratio: "4/5",
  },
  {
    slug: "teka-motion",
    index: "M2",
    title: "Teka",
    category: "Motion Graphics · Peça de marca",
    ficha: "10 s · 1080×1350 · 30 fps",
    description:
      "O logótipo da Teka tem um quadrado antes do nome. A peça agarra-se a ele: o quadrado cai, ressalta, e cada aterragem faz nascer uma letra. Depois cada letra sai do sítio e deixa lá o eletrodoméstico que lhe corresponde — a marca inteira lê-se como uma cozinha.",
    highlights: [
      "Três actos encadeados: o quadrado dá as letras, as letras dão os produtos, a marca viaja para o canto",
      "T torneira, E forno, K placa, A frigorífico — um de cada vez, com as letras vizinhas a afastar-se para dar espaço",
      "Fecho com o exaustor a crescer e o slogan de 2018 da marca, «Uma receita para a vida»",
      "Som construído efeito a efeito, um por objeto: água na torneira, porta no forno, selo no frigorífico",
    ],
    stack: ["Remotion", "React", "SVG", "Motion Graphics"],
    video: "/media/web/teka-motion.mp4",
    poster: "/media/web/teka-motion-poster.jpg",
    alt: "Fotograma da peça Teka: um forno ocupa o lugar do E na palavra TEKA, sobre vermelho",
    ratio: "4/5",
  },
  {
    slug: "imaginar",
    index: "M3",
    title: "Imaginar",
    category: "Motion Graphics · Peça de autor",
    ficha: "14,5 s · 1080×1920 · 30 fps",
    description:
      "Da frase à imagem, e da imagem ao cartaz. Abre numa caixa de escrita vazia, escreve-se lá uma ideia à frente de quem vê, e a ideia ganha corpo: a paisagem aparece, a grelha assenta por cima e o cartaz compõe-se sozinho. Fecha assinado, na mesma paisagem já em contraluz.",
    highlights: [
      "A ideia é escrita em cena, letra a letra — o vídeo mostra o processo, não só o resultado",
      "O cartaz monta-se em camadas: grelha, título, legendas nos cantos e a paleta de cor a assentar por último",
      "Um só cenário do princípio ao fim: o que muda é a luz e o que está escrito por cima",
    ],
    stack: ["Motion Graphics", "Direção de arte", "Edição de vídeo"],
    video: "/media/web/imaginar.mp4",
    poster: "/media/web/imaginar-poster.jpg",
    alt: "Fotograma da peça Imaginar: a palavra «imaginar» sobre uma colina ao pôr do sol",
    ratio: "9/16",
  },
  {
    slug: "reel-apresentacao",
    index: "M4",
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
    ratio: "9/16",
  },
  {
    slug: "reel-portugal",
    index: "M5",
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
    ratio: "9/16",
  },
  {
    slug: "rafalice-anuncio",
    index: "M6",
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
    ratio: "9/16",
  },
];
