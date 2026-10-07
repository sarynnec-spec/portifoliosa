/**
 * Competências técnicas, agrupadas por área.
 *
 * Fonte: o que está de facto construído no VerdeFácil, no VerdeFácil Agro e no
 * ImobAI — ver `projects.ts`. Nada aqui é aspiracional: cada ferramenta
 * listada foi usada num destes projetos.
 *
 * `icone` aponta para `/ferramentas/tec/<ficheiro>.svg` (marcas monocromáticas
 * oficiais). `cor` é a cor da marca, aplicada por CSS — sem ela todos os
 * ícones sairiam na mesma tinta e deixavam de se distinguir.
 */

export type Ferramenta = {
  nome: string;
  icone?: string;
  cor?: string;
};

export type AreaCompetencia = {
  titulo: string;
  descricao: string;
  ferramentas: Ferramenta[];
  praticas: string[];
};

export const areas: AreaCompetencia[] = [
  {
    titulo: "Frontend",
    descricao:
      "Interfaces responsivas e acessíveis, ligadas a serviços de backend e organizadas em componentes reutilizáveis.",
    ferramentas: [
      { nome: "HTML5", icone: "html5", cor: "#E34F26" },
      { nome: "CSS3", icone: "css3", cor: "#1572B6" },
      { nome: "JavaScript", icone: "javascript", cor: "#F7DF1E" },
      { nome: "TypeScript", icone: "typescript", cor: "#3178C6" },
      { nome: "React", icone: "react", cor: "#61DAFB" },
      { nome: "Next.js", icone: "nextdotjs", cor: "#000000" },
      { nome: "Tailwind CSS", icone: "tailwindcss", cor: "#06B6D4" },
      { nome: "Figma", icone: "figma", cor: "#F24E1E" },
    ],
    praticas: [
      "Componentes reutilizáveis",
      "Design responsivo",
      "Acessibilidade (WCAG)",
      "Server e client components",
      "HTML semântico",
      "Animação com GSAP e Framer Motion",
    ],
  },
  {
    titulo: "Backend",
    descricao:
      "Lógica de negócio, APIs e regras de acesso, com as responsabilidades separadas do que serve HTTP.",
    ferramentas: [
      { nome: "Node.js", icone: "nodedotjs", cor: "#5FA04E" },
      { nome: "TypeScript", icone: "typescript", cor: "#3178C6" },
      { nome: "Python", icone: "python", cor: "#3776AB" },
      { nome: "Prisma", icone: "prisma", cor: "#2D3748" },
      { nome: "Zod", icone: "zod", cor: "#3E67B1" },
      { nome: "Stripe", icone: "stripe", cor: "#635BFF" },
    ],
    praticas: [
      "APIs REST com contrato OpenAPI",
      "Autenticação e sessões",
      "Permissões por capacidade (CBAC)",
      "Validação de entrada com o mesmo schema no cliente e no servidor",
      "Tratamento de erros e respostas",
      "Webhooks de entrada e de saída",
    ],
  },
  {
    titulo: "Bases de dados",
    descricao:
      "Modelação, integridade e consultas — com as regras garantidas na base de dados, não só na aplicação.",
    ferramentas: [
      { nome: "PostgreSQL", icone: "postgresql", cor: "#4169E1" },
      { nome: "Supabase", icone: "supabase", cor: "#3FCF8E" },
      { nome: "Prisma", icone: "prisma", cor: "#2D3748" },
      { nome: "Redis", icone: "redis", cor: "#FF4438" },
    ],
    praticas: [
      "Modelação de tabelas e relações",
      "Junções, agregações e índices",
      "Row Level Security e isolamento multi-tenant",
      "Migrações versionadas",
      "Chaves únicas e integridade referencial",
      "Filas de processamento",
    ],
  },
  {
    titulo: "Qualidade e entrega",
    descricao:
      "Testes, revisão e publicação — e a disciplina de medir antes e depois de cada alteração.",
    ferramentas: [
      { nome: "Git", icone: "git", cor: "#F05032" },
      { nome: "GitHub", icone: "github", cor: "#181717" },
      { nome: "GitHub Actions", icone: "githubactions", cor: "#2088FF" },
      { nome: "Vitest", icone: "vitest", cor: "#6E9F18" },
      { nome: "Vercel", icone: "vercel", cor: "#000000" },
    ],
    praticas: [
      "Testes unitários e de integração",
      "Testes ponta-a-ponta com Playwright",
      "Branches, commits e pull requests",
      "Integração e entrega contínuas",
      "Depuração e investigação de falhas",
      "Auditoria de segredos e proteção de credenciais",
    ],
  },
  {
    titulo: "IA aplicada e automação",
    descricao:
      "Modelos de linguagem integrados em produto, e processos que correm sozinhos.",
    ferramentas: [
      { nome: "Claude", icone: "claude", cor: "#D97757" },
      { nome: "OpenAI", icone: "openai", cor: "#412991" },
      { nome: "Python", icone: "python", cor: "#3776AB" },
      { nome: "NumPy", icone: "numpy", cor: "#013243" },
      { nome: "OpenCV", icone: "opencv", cor: "#5C3EE8" },
    ],
    praticas: [
      "Integração de LLMs por API",
      "Cadeia de fallback entre provedores",
      "Extração estruturada de imagem e voz",
      "Tarefas agendadas e workers em fila",
      "Validação do que entra antes de sair para APIs externas",
      "Processamento de imagem e de dados",
    ],
  },
  {
    titulo: "Desenvolvimento assistido por IA",
    descricao:
      "Uso do Claude Code como acelerador de implementação, com as decisões de arquitetura e os critérios de aceitação do meu lado. O que faz o método funcionar é a verificação, não a ferramenta.",
    ferramentas: [{ nome: "Claude Code", icone: "claude", cor: "#D97757" }],
    praticas: [
      "Especificação do problema antes de pedir código",
      "Uma alteração de cada vez, medida antes e depois",
      "Revisão e validação de tudo o que é gerado",
      "Nunca alterar um teste para ele passar",
      "Distinguir o medido do assumido",
      "Agentes, skills e ficheiros de contexto do projeto",
      "Automação de tarefas repetidas por hooks e comandos",
      "Auditoria de segurança sobre o código produzido",
    ],
  },
];
