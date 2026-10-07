/**
 * Percurso profissional e formação.
 * Fonte exclusiva: Curriculo-Sarynne-Ferreira.pdf
 */

export type Role = {
  period: string;
  title: string;
  company: string;
  detail?: string;
  current?: boolean;
};

export const roles: Role[] = [
  {
    period: "2025 — presente",
    title: "Designer Gráfica & Social Media",
    company: "Projetos de Multimédia & Design (formação / freelance)",
    detail:
      "Criação de posts e artes promocionais, gestão de campanhas de tráfego pago (Meta, Google, YouTube e TikTok Ads) e desenvolvimento de identidade visual para marcas como Verde Fácil e Salgados Rafalice.",
    current: true,
  },
  {
    period: "04/2022 — 09/2025",
    title: "Consultora Ótica",
    company: "Cornúcopia Paradise Lda (QLook Ótica)",
    detail: "Atendimento ao público e aconselhamento especializado.",
  },
  {
    period: "03/2022 — 12/2023",
    title: "Operadora de Produção",
    company: "Frunbrab",
  },
  {
    period: "11/2019 — 08/2021",
    title: "Consultora Financeira",
    company: "Gas Consultoria e Tecnologia Ltda",
  },
  {
    period: "11/2016 — 10/2019",
    title: "Consultora Ótica / Gerente",
    company: "Jomon Comércios e Artigos Óticos Ltda",
    detail: "Gestão da loja, atendimento ao cliente e coordenação da equipa.",
  },
];

export type Education = {
  period: string;
  course: string;
  school: string;
  status?: string;
};

export const education: Education[] = [
  {
    period: "desde out. 2025",
    course: "Curso Técnico em Multimédia",
    school: "IEFP — Instituto do Emprego e Formação Profissional",
  },
  {
    period: "2024",
    course: "Curso de Inglês — Nível 1 (Básico)",
    school: "Universidade de Aveiro",
  },
  {
    period: "2007",
    course: "Ensino Médio Completo",
    school: "Escola Estadual José Brandão",
  },
];

/**
 * Competências e habilidades.
 *
 * ⚠️ As técnicas abriram a lista a 2026-10-07 e **não constam do CV** — vêm do
 * VerdeFácil e do ImobAI. Ao atualizar o currículo, acrescentá-las lá também:
 * senão o portfólio e o PDF em anexo contam histórias diferentes.
 */
export const skills: string[] = [
  "Desenvolvimento web full stack — TypeScript, React e Next.js",
  "PostgreSQL — modelação de dados, consultas e migrações",
  "APIs REST — desenvolvimento, autenticação e documentação em OpenAPI",
  "Integração de modelos de linguagem (LLM) por API",
  "Automação — webhooks, tarefas agendadas e filas de processamento",
  "Testes automatizados e depuração — Vitest e Playwright",
  "Git, trabalho com branches e CI/CD com GitHub Actions",
  "Python — processamento de imagem e de dados",
  "Segurança — autenticação, permissões e proteção de credenciais",
  "Design gráfico e identidade visual",
  "Criação de conteúdo e posts para redes sociais",
  "Campanhas de tráfego pago (Meta, Google, TikTok e YouTube Ads)",
  "Edição de imagem e vídeo",
  "UX/UI Design — Figma",
  "Gestão de redes sociais",
  "Atendimento e relacionamento com o cliente",
  "Gestão e coordenação de equipas",
  "Pacote Office / Microsoft Excel",
  "Organização e trabalho em equipa",
];
