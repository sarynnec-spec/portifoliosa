/**
 * Clientes e o que foi entregue a cada um.
 *
 * A secção nasceu de um pedido dela: ver a peça de um lado e, do outro, a
 * lista do que foi feito para aquela marca — «foi criado logo, foi feito
 * post, vídeos e campanhas ads».
 *
 * Porque é que isto vive FORA das fichas de projeto: o carrossel passa de um
 * cliente para o outro. Dentro da ficha da Rafalice, uma peça da Valentina a
 * passar a seguir lia-se como trabalho da Rafalice — e isso não é verdade.
 *
 * ⚠️ As peças da Valentina trazem o telefone e a morada REAIS do salão
 * (Travessa 5 de Outubro, n.º 20, Gondomar · +351 932 309 330). São posts já
 * publicados por ela, por isso a informação já é pública — mas é de notar
 * antes de as pôr em mais algum lado.
 */

export type Cliente = {
  slug: string;
  nome: string;
  /** Uma linha: que negócio é e onde. */
  contexto: string;
  /**
   * Logótipo da marca, para encabeçar a ficha — como já acontece nas fichas
   * de projeto. Os dois são PNG com fundo transparente, recortados à caixa
   * do desenho: com a margem que traziam, o selo ficava desalinhado do nome.
   */
  logo: { src: string; alt: string };
  /** O que foi entregue. Só o que é verdade — nada de encher a lista. */
  entregas: string[];
  /**
   * O que as configurações fazem — fica num bloco à parte, por baixo da
   * lista, a pedido dela. Misturado nas entregas, a lista passava de seis
   * para dez linhas e o que foi mesmo produzido deixava de se destacar.
   *
   * ⚠️ Isto veio da descrição dela (2026-10-16) e NÃO foi verificado contra
   * nada: ao contrário das peças, que estão nos ficheiros e se podem ver,
   * é serviço prestado e não deixa artefacto. Fica pela palavra dela.
   */
  alcance: string[];
  /**
   * Redes onde a gestão e os anúncios correm. Marcado nos dois clientes, a
   * pedido dela — é o trabalho que quer em destaque.
   */
  redes: Array<"instagram" | "facebook" | "meta" | "tiktok" | "google">;
};

export type PecaCliente = {
  cliente: string;
  src: string;
  alt: string;
  caption: string;
};

export const clientes: Cliente[] = [
  {
    slug: "rafalice",
    nome: "Salgados Rafalice",
    contexto: "Salgados artesanais — venda por encomenda",
    logo: {
      src: "/media/brand/rafalice-logo-trim.png",
      alt: "Logótipo Salgados Rafalice — mascote com chapéu de chefe",
    },
    redes: ["instagram", "facebook", "meta"],
    entregas: [
      // Ordenadas do texto MAIS CURTO para o mais comprido, a pedido dela:
      // «vídeo tá no meio de textos grandes, acima, fica feio». Com as
      // curtas no meio a lista fica aos dentes; em escada, o bloco lê-se
      // equilibrado. A ordem é visual, não de importância.
      "Vídeos",
      "Posts para redes sociais",
      "Configurações na plataforma",
      "Criação do logótipo, com mascote",
      "Campanhas para público qualificado",
      "Campanhas de anúncios no Facebook e Instagram",
    ],
    alcance: [
      "Conteúdo a chegar a quem ainda não segue a página",
      "Imagens e vídeos a aparecerem na pesquisa do Google",
      "Marca preparada para ser recomendada nas respostas das IA",
    ],
  },
  {
    slug: "valentina",
    nome: "Valentina & Tendências Brasileiras",
    contexto: "Salão de cabeleireiro em Gondomar",
    logo: {
      src: "/media/brand/valentina-logo.png",
      alt: "Logótipo Valentina & Tendências Brasileiras — águia dourada",
    },
    // A Valentina leva também TikTok e Google; a Rafalice não — foi o que
    // ela disse, e não se alarga a lista de um cliente com a do outro.
    redes: ["instagram", "facebook", "meta", "tiktok", "google"],
    entregas: [
      // Ordenadas do texto MAIS CURTO para o mais comprido, a pedido dela:
      // «vídeo tá no meio de textos grandes, acima, fica feio». Com as
      // curtas no meio a lista fica aos dentes; em escada, o bloco lê-se
      // equilibrado. A ordem é visual, não de importância.
      "Site",
      "Banner",
      "Vídeos",
      "Cartão de visita",
      "Gestão das redes sociais",
      "Configurações na plataforma",
      // Ela escreveu «faixada» e perguntou-me como se diz: é FACHADA, e o
      // material é vinil autocolante.
      "Fachada nova em vinil autocolante",
      "Campanhas para público qualificado",
    ],
    alcance: [
      "Conteúdo a chegar a quem ainda não segue a página",
      "Imagens e vídeos a aparecerem na pesquisa do Google",
      "Marca preparada para ser recomendada nas respostas das IA",
    ],
  },
];

/*
 * As peças, pela ordem em que passam. A primeira é a da Rafalice — foi a que
 * ela escolheu («colocar somente essa foto»), em vez das quatro que a ficha
 * do projeto mostra.
 */
export const pecasClientes: PecaCliente[] = [
  {
    cliente: "rafalice",
    src: "/media/brand/rafalice-artesanais.jpg",
    alt: "Post «Salgados artesanais, feitos com amor», com coxinhas e empadas em creme e dourado",
    caption: "Rafalice · Post de marca",
  },
  {
    cliente: "valentina",
    src: "/media/brand/valentina-autoestima.jpg",
    alt: "Post do salão Valentina: «Cabelo saudável é reflexo de uma autoestima forte», sobre fundo verde-escuro e dourado",
    caption: "Valentina · Post de marca",
  },
  {
    cliente: "valentina",
    src: "/media/brand/valentina-convite-3anos.jpg",
    alt: "Convite de aniversário de 3 anos do salão Valentina, com envelope verde e rosa vermelha",
    caption: "Valentina · Convite de 3 anos",
  },
  {
    cliente: "valentina",
    src: "/media/brand/valentina-cor.jpg",
    alt: "Peça editorial «Cor, brilho e beleza» do salão Valentina, com antes e depois de coloração",
    caption: "Valentina · Editorial de cor",
  },
  {
    cliente: "valentina",
    src: "/media/brand/valentina-28-outubro.jpg",
    alt: "Cartaz tipográfico do aniversário do salão Valentina: «28 de outubro, dia que queremos presentear você»",
    caption: "Valentina · Cartaz de aniversário",
  },
];
