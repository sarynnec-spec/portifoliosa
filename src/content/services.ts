/**
 * Serviços / áreas de atuação.
 * Fonte: secção "Serviços" de portfolio-sarynne + competências do CV.
 * As ferramentas listadas são as que constam desses ficheiros.
 */

export type Service = {
  index: string;
  title: string;
  description: string;
  tools: string[];
};

export const services: Service[] = [
  {
    index: "01",
    title: "Desenvolvimento Web Full Stack",
    description:
      "Aplicações web de ponta a ponta: interfaces em React e TypeScript ligadas à lógica de negócio, com a validação a correr pelo mesmo schema no cliente e no servidor.",
    tools: ["TypeScript", "React", "Next.js", "Node.js", "HTML/CSS", "Zod"],
  },
  {
    index: "02",
    title: "Bases de Dados & APIs",
    description:
      "Modelação de tabelas e relações, regras de integridade e consultas. APIs REST documentadas em OpenAPI, com autenticação, permissões e tratamento de erros.",
    tools: ["PostgreSQL", "Prisma", "Supabase", "REST", "OpenAPI", "Row Level Security"],
  },
  {
    index: "03",
    title: "IA Aplicada & Automação",
    description:
      "Integração de modelos de linguagem por API: assistentes, extração de informação de imagem e voz. Automações com webhooks, tarefas agendadas e filas de processamento.",
    tools: ["LLMs por API", "OCR", "Transcrição de voz", "Webhooks", "Cron jobs", "Redis/BullMQ"],
  },
  {
    index: "04",
    title: "Qualidade & Segurança",
    description:
      "Testes automatizados, depuração e cuidados de segurança: validação de dados, autenticação, permissões por capacidade e proteção de credenciais.",
    tools: ["Vitest", "Playwright", "CI/CD", "Git", "Auditoria de segredos", "MFA/TOTP"],
  },
  {
    index: "05",
    title: "Design Gráfico",
    description:
      "Logos, flyers, cartazes e identidade visual. Peças pensadas para comunicar com clareza e personalidade.",
    tools: ["Logotipos", "Identidade visual", "Flyers", "Cartazes"],
  },
  {
    index: "06",
    title: "UX/UI Design",
    description:
      "Interfaces de apps e websites no Figma, do wireframe ao protótipo navegável — como o app PULSE.",
    tools: ["Figma", "Mobile", "Protótipo", "Design system"],
  },
  {
    index: "07",
    title: "Gestão de Redes Sociais",
    description:
      "Criação de conteúdo, calendário editorial e posts para manter a marca ativa e consistente.",
    tools: ["Instagram", "Facebook", "TikTok"],
  },
  {
    index: "08",
    title: "Tráfego Pago / Ads",
    description:
      "Campanhas de anúncios para alcançar o público certo e transformar visualizações em clientes.",
    tools: ["Meta Ads", "Google Ads", "YouTube Ads", "TikTok Ads"],
  },
  {
    index: "09",
    title: "Edição de Vídeo",
    description:
      "Reels, shorts e vídeos promocionais editados para prender a atenção nos primeiros segundos.",
    tools: ["Reels", "Shorts", "Vídeo promocional"],
  },
  {
    index: "10",
    title: "Fotografia & Imagem",
    description:
      "Captação e edição de imagem para produtos, conteúdo e redes sociais.",
    tools: ["Produto", "Conteúdo", "Retoque"],
  },
];
