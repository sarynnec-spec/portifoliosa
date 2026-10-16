/**
 * Vídeo para marcas — as peças feitas sobre imagens do cliente.
 *
 * Secção à parte do Motion, e por um motivo de verdade: no Motion as peças
 * são construídas por ela de raiz, muitas em código. Aqui a imagem vem da
 * marca; o que é dela é a montagem, o ritmo e o grafismo por cima. Misturar
 * as duas coisas no mesmo carrossel dava a entender que filmou o que não
 * filmou.
 *
 * Números medidos nos próprios ficheiros (duração, formato, fps) — nada aqui
 * é estimado. Ver também a nota sobre a loja masculina, mais abaixo.
 */

export type PecaVitrine = {
  slug: string;
  index: string;
  titulo: string;
  categoria: string;
  /** Linha curta de ficha técnica: duração, formato, cadência. */
  ficha: string;
  descricao: string;
  video: string;
  poster: string;
  alt: string;
  /**
   * Forma real do ficheiro, em `largura/altura`. O cartão toma-a tal e qual:
   * as quatro peças não têm todas a mesma forma (duas são 9:16 exactos, as
   * de loja são 0,655 e 0,643) e, com um cartão de forma fixa, ou sobravam
   * faixas ou se cortava imagem. Nenhuma das duas é aceitável aqui.
   */
  ratio: string;
};

export const vitrine: PecaVitrine[] = [
  {
    slug: "ville-imobiliaria",
    index: "01",
    titulo: "Ville Gestão Imobiliária",
    categoria: "Edição de Vídeo · Motion Graphics",
    ficha: "37,4 s · 1080×1920 · 30 fps",
    descricao:
      "Visita vertical a imóveis de gama alta, que se fecha na marca: a imagem dissolve-se em branco e o logótipo monta-se por partes, do símbolo ao registo.",
    video: "/media/web/ville-imobiliaria.mp4",
    poster: "/media/web/ville-imobiliaria-poster.jpg",
    alt: "Sala de estar de pé-direito alto com vão envidraçado sobre a piscina, com a marca de água VILLE no canto",
    ratio: "9/16",
  },
  {
    slug: "loja-masculina",
    index: "02",
    /*
     * 🔴 O nome desta loja NÃO está no ficheiro. Esta peça não tem cartão de
     * marca nem letreiro legível em sítio nenhum — procurei fotograma a
     * fotograma no início e no fim, e não há. O título e o `alt` têm de vir
     * dela: não se inventa o nome de uma loja real.
     */
    titulo: "Loja de moda masculina",
    categoria: "Edição de Vídeo · Montagem",
    ficha: "27,9 s · 576×896 · 30 fps",
    descricao:
      "Visita a uma loja de moda masculina multimarca. O percurso segue a planta da loja e não a lista de produtos — anda-se por ela como se anda lá dentro.",
    video: "/media/web/loja-masculina.mp4",
    poster: "/media/web/loja-masculina-poster.jpg",
    alt: "Interior de uma loja de moda masculina, com mesa central de malhas dobradas e araras de fatos ao fundo",
    ratio: "576/896",
  },
  {
    slug: "venice-burger",
    index: "03",
    titulo: "Venice Burger",
    categoria: "Edição de Vídeo · Tipografia cinética",
    ficha: "12,1 s · 1080×1920 · 30 fps",
    descricao:
      "Doze segundos sobre uma pergunta só — «vamos pedir um hambúrguer hoje?» — e quatro respostas cada vez mais curtas, cada uma sobre um hambúrguer diferente.",
    video: "/media/web/venice-burger.mp4",
    poster: "/media/web/venice-burger-poster.jpg",
    alt: "Hambúrguer duplo com molho barbecue e queijo derretido, sob a pergunta «Vamos pedir um hambúrguer hoje?»",
    ratio: "9/16",
  },
  {
    slug: "loja-algo-bonito",
    index: "04",
    titulo: "Algo Bonito",
    categoria: "Edição de Vídeo · Montagem",
    ficha: "20,2 s · 576×880 · 30 fps",
    descricao:
      "Visita a uma loja de roupa de senhora: abre na montra, percorre as araras com a luz quente da loja, e fecha onde abriu. Quem assina é o letreiro, filmado.",
    video: "/media/web/loja-algo-bonito.mp4",
    poster: "/media/web/loja-algo-bonito-poster.jpg",
    alt: "Montra iluminada de uma loja de roupa de senhora, com o letreiro «algo bonito» em néon branco sobre azul",
    ratio: "576/880",
  },
];
