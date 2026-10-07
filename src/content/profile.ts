/**
 * Dados pessoais e profissionais reais de Sarynne.
 * Fonte: Curriculo-Sarynne-Ferreira.pdf + portfolio-sarynne/index.html
 * Nada aqui deve ser inventado.
 */

export const profile = {
  firstName: "Sarynne",
  lastName: "Ferreira",
  fullName: "Sarynne Laís Coelho Ferreira",
  /*
   * As duas frentes têm de aparecer: ela candidata-se a vagas de
   * desenvolvimento E de design, e o `role` vai para o <title> da página — com
   * só uma delas, metade dos recrutadores fecha o separador.
   */
  role: "Full Stack, IA e Automação · Design Digital",
  roleShort: "Full Stack · IA · Design Digital",
  status: "Técnica de Multimédia · IEFP",
  location: "Aveiro, Portugal",
  timeZone: "Europe/Lisbon",
  availability: "Disponível para trabalho",
  internshipHours: "210h",
  email: "sarynnec@gmail.com",
  phone: "+351 932 326 515",
  phoneHref: "+351932326515",
  whatsapp: "https://wa.me/351932326515",
  linkedin: "https://www.linkedin.com/in/sarynne-coelho-ferreira",
  linkedinHandle: "/sarynne-coelho-ferreira",
  github: "https://github.com/sarynnec-spec",
  githubHandle: "@sarynnec-spec",
  cvFile: "/Curriculo-Sarynne-Ferreira.pdf",
  cvFileEn: "/Resume-Sarynne-Ferreira.pdf",
  portrait: "/media/me/sarynne.png",
  showreel: "/media/me/showreel.mp4",
} as const;

/** Perfil profissional — resumo do CV. */
export const summary =
  "Construo aplicações web de ponta a ponta — interface, lógica de negócio, base de dados e APIs — e trabalho igualmente em design gráfico, motion design e UX/UI. Técnica de Multimédia pelo IEFP (nível 4), formação que junta programação e design, com uma base comercial de anos em atendimento, gestão de loja e consultoria. O VerdeFácil, plataforma SaaS de faturação fiscal que desenvolvi de raiz, junta as duas coisas: perceber o problema de quem o vai usar e construir o produto que o resolve.";

/** Frase-manifesto revelada palavra a palavra no scroll. Construída a partir do perfil do CV. */
export const manifesto =
  "Levo um produto da ideia ao código em produção: desenho a base de dados, construo a interface, ligo as APIs e escrevo os testes que provam que funciona.";

export const about = {
  heading: "Da gestão comercial ao software e ao design.",
  paragraphs: [
    "Depois de anos em atendimento ao público, gestão de loja e consultoria comercial e financeira, a formação de Técnica de Multimédia no IEFP deu-me as bases de design e interface. Daí fui à procura do que faltava: construir o produto inteiro, e não apenas o que se vê.",
    "Hoje trabalho de ponta a ponta — modelo de dados, lógica de negócio, APIs e testes. O VerdeFácil nasceu assim, de raiz: uma plataforma de faturação fiscal onde cada decisão técnica foi minha, e onde aprendi que a parte difícil não é escrever código, é provar que está certo.",
    "Trago organização, foco em resultados e um olhar de quem entende o cliente — porque já estive dos dois lados do balcão. Procuro uma equipa onde possa aplicar o que construí e continuar a crescer.",
  ],
  facts: [
    { label: "Base", value: "Aveiro, Portugal" },
    { label: "Formação", value: "Técnica de Multimédia · IEFP" },
    { label: "Idiomas", value: "Português (nativo) · Inglês (básico)" },
    { label: "Estágio", value: "210h · a partir de set. 2026" },
  ],
} as const;

/** Disciplinas para a faixa em movimento — apenas competências que constam do CV. */
export const disciplines = [
  "Design Gráfico",
  "Motion Design",
  "Web Design",
  "UX/UI Design",
  "Identidade Visual",
  "Tráfego Pago",
  "Edição de Vídeo",
  "Social Media",
  "Edição de Imagem",
  "Criação de Conteúdo",
];

/**
 * `href` só existe nos destinos externos. Sem ele, o item é uma âncora para a
 * secção com o mesmo `id` — e é por essas que o observador decide qual está
 * ativa, pelo que os externos ficam de fora sem precisar de exceção.
 */
export const navItems = [
  { id: "sobre", label: "Sobre" },
  { id: "servicos", label: "Serviços" },
  { id: "motion", label: "Motion" },
  { id: "trabalho", label: "Trabalho" },
  { id: "competencias", label: "Competências" },
  { id: "percurso", label: "Percurso" },
  { id: "github", label: "GitHub", href: profile.github },
  { id: "contacto", label: "Contacto" },
];
