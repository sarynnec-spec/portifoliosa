/**
 * Peças que alimentam o túnel da secção "Peças que circulam".
 *
 * Ficheiros em public/media/tunel/ — originais em tamanho grande guardados
 * fora do deploy, em assets/tunel-originais/.
 *
 * ATENÇÃO ao número total: o componente escolhe a imagem com
 * `imageMats[(3 * i) % N]`. Se N for múltiplo de 3, só N/3 imagens chegam a
 * aparecer — as restantes ficam invisíveis. Atualmente N = 43
 * (OK).
 *
 * O `alt` é genérico de propósito: descreve o que se sabe ser verdade sem
 * inventar marcas. Podes substituir cada linha por uma descrição real.
 */

export type Piece = {
  src: string;
  alt: string;
};

export const pieces: Piece[] = [
  {
    src: "/media/tunel/tunel-01.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (1 de 43)",
  },
  {
    src: "/media/tunel/tunel-02.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (2 de 43)",
  },
  {
    src: "/media/tunel/tunel-03.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (3 de 43)",
  },
  {
    src: "/media/tunel/tunel-04.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (4 de 43)",
  },
  {
    src: "/media/tunel/tunel-05.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (5 de 43)",
  },
  {
    src: "/media/tunel/tunel-06.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (6 de 43)",
  },
  {
    src: "/media/tunel/tunel-07.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (7 de 43)",
  },
  {
    src: "/media/tunel/tunel-08.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (8 de 43)",
  },
  {
    src: "/media/tunel/tunel-10.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (9 de 43)",
  },
  {
    src: "/media/tunel/tunel-11.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (10 de 43)",
  },
  {
    src: "/media/tunel/tunel-12.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (11 de 43)",
  },
  {
    src: "/media/tunel/tunel-13.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (12 de 43)",
  },
  {
    src: "/media/tunel/tunel-14.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (13 de 43)",
  },
  {
    src: "/media/tunel/tunel-15.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (14 de 43)",
  },
  {
    src: "/media/tunel/tunel-16.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (15 de 43)",
  },
  {
    src: "/media/tunel/tunel-17.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (16 de 43)",
  },
  {
    src: "/media/tunel/tunel-18.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (17 de 43)",
  },
  {
    src: "/media/tunel/tunel-19.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (18 de 43)",
  },
  {
    src: "/media/tunel/tunel-20.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (19 de 43)",
  },
  {
    src: "/media/tunel/tunel-21.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (20 de 43)",
  },
  {
    src: "/media/tunel/tunel-22.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (21 de 43)",
  },
  {
    src: "/media/tunel/tunel-23.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (22 de 43)",
  },
  {
    src: "/media/tunel/tunel-24.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (23 de 43)",
  },
  {
    src: "/media/tunel/tunel-25.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (24 de 43)",
  },
  {
    src: "/media/tunel/tunel-26.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (25 de 43)",
  },
  {
    src: "/media/tunel/tunel-27.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (26 de 43)",
  },
  {
    src: "/media/tunel/tunel-28.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (27 de 43)",
  },
  {
    src: "/media/tunel/tunel-29.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (28 de 43)",
  },
  {
    src: "/media/tunel/tunel-30.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (29 de 43)",
  },
  {
    src: "/media/tunel/tunel-31.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (30 de 43)",
  },
  {
    src: "/media/tunel/tunel-32.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (31 de 43)",
  },
  {
    src: "/media/tunel/tunel-33.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (32 de 43)",
  },
  {
    src: "/media/tunel/tunel-34.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (33 de 43)",
  },
  {
    src: "/media/tunel/tunel-35.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (34 de 43)",
  },
  {
    src: "/media/tunel/tunel-36.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (35 de 43)",
  },
  {
    src: "/media/tunel/tunel-37.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (36 de 43)",
  },
  {
    src: "/media/tunel/tunel-38.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (37 de 43)",
  },
  {
    src: "/media/tunel/tunel-39.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (38 de 43)",
  },
  {
    src: "/media/tunel/tunel-40.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (39 de 43)",
  },
  {
    src: "/media/tunel/tunel-41.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (40 de 43)",
  },
  {
    src: "/media/tunel/tunel-42.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (41 de 43)",
  },
  {
    src: "/media/tunel/tunel-43.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (42 de 43)",
  },
  {
    src: "/media/tunel/tunel-44.jpg",
    alt: "Peça de social media criada por Sarynne Ferreira (43 de 43)",
  },
];

export const pieceCount = pieces.length;
