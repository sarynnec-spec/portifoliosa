/**
 * Dados pessoais e profissionais reais de Sarynne.
 * Fonte: Curriculo-Sarynne-Ferreira.pdf + portfolio-sarynne/index.html
 * Nada aqui deve ser inventado.
 */

export const profile = {
  firstName: "Sarynne",
  lastName: "Ferreira",
  fullName: "Sarynne Laís Coelho Ferreira",
  role: "Design Digital & Multimédia",
  roleShort: "Designer & Técnica de Multimédia",
  status: "Técnica de Multimédia · IEFP",
  location: "Aveiro, Portugal",
  timeZone: "Europe/Lisbon",
  availability: "Disponível para trabalho a partir de 3 de novembro de 2026",
  internshipHours: "210h",
  email: "sarynnec@gmail.com",
  phone: "+351 932 326 515",
  phoneHref: "+351932326515",
  whatsapp: "https://wa.me/351932326515",
  linkedin: "https://www.linkedin.com/in/sarynne-coelho-ferreira",
  linkedinHandle: "/sarynne-coelho-ferreira",
  cvFile: "/Curriculo-Sarynne-Ferreira.pdf",
  portrait: "/media/me/sarynne.png",
  showreel: "/media/me/showreel.mp4",
} as const;

/** Perfil profissional — resumo do CV. */
export const summary =
  "Profissional criativa com formação de Técnica de Multimédia no IEFP, com experiência sólida em atendimento ao público, gestão comercial e coordenação de equipas. Atualmente dedico-me ao design gráfico, motion design, web design, criação de conteúdo para redes sociais, gestão de campanhas de anúncios e design de interfaces (UX/UI).";

/** Frase-manifesto revelada palavra a palavra no scroll. Construída a partir do perfil do CV. */
export const manifesto =
  "Orientada para resultados, organizada e comprometida, uno visão de negócio a competências digitais e criativas. Desenho interfaces, crio conteúdo e giro campanhas.";

export const about = {
  heading: "Da gestão comercial ao design digital.",
  paragraphs: [
    "Depois de anos em atendimento ao público, gestão de loja e consultoria comercial e financeira, decidi unir essa vivência com a criatividade. A formação de Técnica de Multimédia no IEFP deu-me as bases em design gráfico, edição de imagem e vídeo, criação de conteúdo e desenvolvimento de interfaces.",
    "Trago organização, foco em resultados e um olhar de quem entende o cliente — porque já estive dos dois lados do balcão. Procuro uma equipa onde possa aplicar o que aprendi e continuar a crescer.",
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

export const navItems = [
  { id: "sobre", label: "Sobre" },
  { id: "servicos", label: "Serviços" },
  { id: "trabalho", label: "Trabalho" },
  { id: "motion", label: "Motion" },
  { id: "percurso", label: "Percurso" },
  { id: "contacto", label: "Contacto" },
];
