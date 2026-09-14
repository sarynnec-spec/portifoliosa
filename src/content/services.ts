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
    title: "Design Gráfico",
    description:
      "Logos, flyers, cartazes e identidade visual. Peças pensadas para comunicar com clareza e personalidade.",
    tools: ["Logotipos", "Identidade visual", "Flyers", "Cartazes"],
  },
  {
    index: "02",
    title: "UX/UI Design",
    description:
      "Interfaces de apps e websites no Figma, do wireframe ao protótipo navegável — como o app PULSE.",
    tools: ["Figma", "Mobile", "Protótipo", "Design system"],
  },
  {
    index: "03",
    title: "Gestão de Redes Sociais",
    description:
      "Criação de conteúdo, calendário editorial e posts para manter a marca ativa e consistente.",
    tools: ["Instagram", "Facebook", "TikTok"],
  },
  {
    index: "04",
    title: "Tráfego Pago / Ads",
    description:
      "Campanhas de anúncios para alcançar o público certo e transformar visualizações em clientes.",
    tools: ["Meta Ads", "Google Ads", "YouTube Ads", "TikTok Ads"],
  },
  {
    index: "05",
    title: "Edição de Vídeo",
    description:
      "Reels, shorts e vídeos promocionais editados para prender a atenção nos primeiros segundos.",
    tools: ["Reels", "Shorts", "Vídeo promocional"],
  },
  {
    index: "06",
    title: "Fotografia & Imagem",
    description:
      "Captação e edição de imagem para produtos, conteúdo e redes sociais.",
    tools: ["Produto", "Conteúdo", "Retoque"],
  },
];
