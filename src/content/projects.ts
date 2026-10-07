/**
 * Projetos reais.
 * Fonte: portfolio-sarynne (secções PULSE, Websites, Trabalhos) + CV.
 * Cada campo opcional só é preenchido quando a informação existe nos ficheiros.
 */

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type Project = {
  slug: string;
  index: string;
  title: string;
  category: string;
  year?: string;
  description: string;
  highlights?: string[];
  stack?: string[];
  link?: { href: string; label: string };
  /** Repositório público no GitHub — mostra as pastas e a arquitetura do projeto. */
  repo?: { href: string; label: string };
  /** URL embebido num iframe: a pré-visualização acompanha o site publicado. */
  live?: string;
  /** Projeto principal — ocupa a largura toda no topo da secção. */
  featured?: boolean;
  /** Reel vertical reproduzido dentro do aparelho. */
  video?: string;
  /** Falso quando o ficheiro não leva faixa de áudio: o botão de som não aparece. */
  temSom?: boolean;
  /** Marca do cliente: aparece antes do nome, no cabeçalho do projeto. */
  logo?: ProjectImage;
  cover: ProjectImage;
  gallery?: ProjectImage[];
  /**
   * "carousel": a galeria passa a carrossel em perspetiva, com a peça central
   * de frente e as vizinhas recuadas. Sem isto, fica a fila de miniaturas.
   */
  galleryMode?: "carousel";
  /** Proporção usada na moldura da capa. */
  coverRatio: "phone" | "page" | "square" | "laptop" | "video";
  /**
   * Só para capturas largas: substitui o 4/5 da moldura de janela, que é
   * feito para páginas inteiras e cortaria uma tira estreita de um hero.
   */
  coverAspect?: string;
};

export const projects: Project[] = [
  {
    slug: "sofia-sales",
    index: "01",
    title: "Sofia Sales Clinic",
    category: "Website · Clínica de Medicina Estética",
    description:
      "Site para uma clínica de medicina estética em Rio Tinto: tratamentos, tecnologia de cada protocolo e marcação. Quinze secções em bordô e dourado, com movimento contínuo.",
    highlights: [
      "Abertura com o logótipo a nascer de um portal de luz, animada em GSAP",
      "Introdução e rituais atravessam o ecrã na horizontal enquanto se rola a página",
      "Linhas cinéticas a separar os andamentos, alternando fundo claro e bordô",
      "Scroll suave em Lenis, cursor próprio e contador de secção fixo, de 00 a 14",
    ],
    stack: ["Next.js 15", "React 19", "GSAP", "Identidade visual"],
    live: "https://sofia-sales-clinic.vercel.app",
    link: { href: "https://sofia-sales-clinic.vercel.app", label: "Ver o site" },
    featured: true,
    coverRatio: "page",
    cover: {
      src: "/media/web/poster-sofia-sales.jpg",
      alt: "Página inicial do site da Sofia Sales Clinic",
    },
  },
  {
    slug: "lode",
    index: "02",
    title: "LODÊ",
    category: "Website · Cabeleireiro de Autor",
    description:
      "Site do atelier LODÊ, no Porto — cor de autor, corte à medida e marcação por WhatsApp. Apresenta o atelier, os serviços, os últimos trabalhos e leva o visitante até à marcação.",
    stack: ["Website", "Marcação online", "Identidade visual"],
    link: { href: "https://lode-atelier.vercel.app/", label: "Ver o site" },
    coverRatio: "page",
    cover: {
      src: "/media/web/full-lode.jpg",
      alt: "Página completa do site do atelier LODÊ",
    },
  },
  {
    slug: "pulse",
    index: "03",
    title: "PULSE",
    category: "UX/UI Design · App de Ginásio",
    description:
      "Design completo de uma app de ginásio, do onboarding ao acompanhamento de treino, com componentes reutilizáveis e hierarquia visual clara.",
    highlights: [
      "15+ ecrãs: splash, login, recuperação de senha, início, aulas, detalhe de aula, plano de treino, exercícios, perfil e suporte",
      "Fluxo de reserva de aulas completo, com confirmação e gestão de vagas",
      "Sistema de cores por categoria (Força, HIIT, Funcional, Yoga) e dashboard de progresso",
      "Tema escuro, tipografia forte e microinterações — construído no Figma",
    ],
    stack: ["Figma", "Mobile App", "Design System", "Prototipagem"],
    link: {
      href: "https://www.figma.com/design/19qBnui0RXYD2OoyL2KlLT/PULSE-%E2%80%94-App-de-Gin%C3%A1sio",
      label: "Ver no Figma",
    },
    coverRatio: "phone",
    galleryMode: "carousel",
    cover: {
      src: "/media/pulse/pulse-3-inicio.jpg",
      alt: "PULSE — ecrã de início do app de ginásio",
    },
    gallery: [
      { src: "/media/pulse/pulse-1-splash.jpg", alt: "PULSE — Splash", caption: "01 · Splash" },
      { src: "/media/pulse/pulse-2-login.jpg", alt: "PULSE — Login", caption: "02 · Login" },
      { src: "/media/pulse/pulse-3-inicio.jpg", alt: "PULSE — Início", caption: "03 · Início" },
      { src: "/media/pulse/pulse-4-aulas.jpg", alt: "PULSE — Aulas", caption: "04 · Aulas" },
      { src: "/media/pulse/pulse-5-reserva.jpg", alt: "PULSE — Reserva confirmada", caption: "05 · Reserva" },
      { src: "/media/pulse/pulse-6-treino.jpg", alt: "PULSE — Plano de treino", caption: "06 · Treino" },
      { src: "/media/pulse/pulse-7-exercicio.jpg", alt: "PULSE — Detalhe do exercício", caption: "07 · Exercício" },
      { src: "/media/pulse/pulse-8-perfil.jpg", alt: "PULSE — Perfil", caption: "08 · Perfil" },
      { src: "/media/pulse/pulse-9-apoio.jpg", alt: "PULSE — Apoio ao cliente", caption: "09 · Apoio" },
    ],
  },
  {
    slug: "verde-facil",
    index: "04",
    title: "VerdeFácil",
    category: "SaaS Fiscal · Full Stack, IA e Automação",
    year: "2026",
    description:
      "Plataforma SaaS de faturação e obrigações fiscais para trabalhadores independentes em Portugal, construída de raiz — do modelo de dados aos testes. Cerca de 74 000 linhas e 345 commits em quatro meses e meio.",
    highlights: [
      "Multi-tenant com isolamento garantido na própria base de dados: 139 políticas de Row Level Security sobre 54 tabelas, com FORCE RLS — validado em produção com duas organizações a tentar aceder aos dados uma da outra",
      "API pública versionada com contrato em OpenAPI, autenticação por chave e webhooks de saída cujo URL de destino é validado para impedir alcance à rede interna",
      "Assistente fiscal com cadeia de degradação em cinco níveis (Gemini → Groq → OpenRouter → Claude → resposta estática); OCR de recibos e faturação por voz com transcrição e extração estruturada",
      "Oito tarefas agendadas e cinco workers sobre filas Redis para PDF, SAF-T, comunicação com a Autoridade Tributária e email",
      "199 testes automatizados, com um grupo dedicado a invariantes fiscais: numeração sem buracos, cadeia de assinatura pela ordem de emissão, assinatura RSA coerente com o SAF-T",
      "No upload do OCR, sete validações — incluindo os magic bytes — antes de qualquer byte sair para a API externa; sem isso o endpoint seria um proxy aberto",
    ],
    stack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Supabase",
      "Redis",
      "BullMQ",
      "Stripe",
      "Zod",
      "Vitest",
      "Playwright",
      "GitHub Actions",
    ],
    repo: {
      href: "https://github.com/sarynnec-spec/verdefacil-showcase",
      label: "Ver no GitHub",
    },
    coverRatio: "page",
    cover: {
      src: "/media/web/full-verdefacil.jpg",
      alt: "Website da aplicação VerdeFácil",
    },
  },
  {
    slug: "verde-facil-agro",
    index: "05",
    title: "VerdeFácil Agro",
    category: "Produto & Arquitetura · Vertical agrícola",
    year: "2026",
    description:
      "Vertical agrícola do VerdeFácil, a concurso no Prémio Empreendedorismo e Inovação do Crédito Agrícola. Responde ao que o pequeno agricultor não consegue responder hoje: quanto ganho realmente em cada cultura? Da identificação do problema à arquitetura aprovada.",
    highlights: [
      "A concurso na 13.ª edição do Prémio Empreendedorismo e Inovação do Crédito Agrícola, categoria Desenvolvimento Local",
      "Problema validado em fontes oficiais: mais de 27,8% do rendimento agrícola vem de subsídios (INE), pagos sobretudo entre novembro e junho, e tributados como rendimento (CIRS art. 31.º)",
      "Mercado estudado e quadrante vazio identificado: os softwares agrícolas gerem produção, a contabilidade gere documentos — falta a clareza financeira por cultura ligada à fiscalidade",
      "O utilizador decide a interface: mais de 60 anos e baixa literacia digital levam a registo por voz e missões em vez de menus, e a resultados sempre apresentados como estimativa",
      "Decisão de arquitetura tomada antes da primeira linha de código: o Agro é um segundo vertical do mesmo ecossistema, não um segundo produto — evita duplicar o motor fiscal, que é a parte mais cara de manter",
      "Critério escrito para recusar funcionalidades: «isto aproxima ou afasta um agricultor de ver quanto ganhou por cultura?»",
    ],
    stack: ["Arquitetura", "ADR", "Investigação de mercado", "Modelação de dados", "Prototipagem"],
    repo: {
      href: "https://github.com/sarynnec-spec/verdefacil-agro-showcase",
      label: "Ver no GitHub",
    },
    video: "/media/web/verdefacil-agro-demo.mp4",
    coverRatio: "page",
    coverAspect: "16 / 9",
    cover: {
      src: "/media/web/poster-verdefacil-agro.jpg",
      alt: "VerdeFácil Agro — registo por voz, Recibo do Apoio e painéis do banco e do município",
    },
  },
  {
    slug: "imobai",
    index: "06",
    title: "ImobAI",
    category: "Motor em Python · Visão computacional",
    year: "2026",
    description:
      "Motor em Python que transforma a fotografia de um imóvel em vídeo com movimento de câmara 3D real, preservando os píxeis originais. Profundidade em ONNX sobre CPU, reprojeção e tratamento da disoclusão. 84 ficheiros e 16 883 linhas.",
    highlights: [
      "A regra que define o projeto: qualquer píxel que já existia na fotografia permanece exatamente igual — verificado, não assumido, com outside_hole = 0.00000000 em todos os planos",
      "A descoberta que mudou o produto: o dolly é o único eixo cujo modo de falha é irreparável a partir de uma fotografia. Trocar de eixo levou o artefacto a zero exato",
      "Regra de seleção de movimento saída da medição do gradiente das margens, não de um palpite",
      "Portas de qualidade automáticas e benchmark congelado, corrido antes e depois de cada alteração — várias hipóteses minhas foram refutadas pelos números",
      "Aplicação web em Python que decide quantos renders faz em paralelo a partir da RAM livre: 222 s e pico de 547 MB por render de 1920×1080",
      "Mapa tridimensional do bairro construído a partir de dados abertos do OpenStreetMap, com a localização deliberadamente aproximada e a fonte creditada",
    ],
    stack: [
      "Python",
      "NumPy",
      "OpenCV",
      "ONNX Runtime",
      "Depth Anything V2",
      "OpenStreetMap",
      "FFmpeg",
    ],
    repo: {
      href: "https://github.com/sarynnec-spec/imobai-showcase",
      label: "Ver no GitHub",
    },
    video: "/media/web/imobai-motor.mp4",
    // Sem faixa de áudio: a origem da música não está registada em lado nenhum,
    // e material sem licença confirmada não vai para o portfólio.
    temSom: false,
    // O ficheiro é 1280×854 (3:2) — horizontal. Na moldura de telemóvel do
    // VideoMockup, que é 9:16, saía deformado.
    coverRatio: "page",
    coverAspect: "3 / 2",
    cover: {
      src: "/media/web/poster-imobai.jpg",
      alt: "ImobAI — tour de um apartamento em Paris com movimento de câmara gerado a partir de fotografias",
    },
  },
  {
    slug: "autoshop",
    index: "07",
    title: "AutoShop",
    category: "Website · Stand de Automóveis",
    description:
      "Stand de automóveis premium: catálogo de viaturas com fichas detalhadas, reserva online e lista de favoritos. Tema escuro e design responsivo.",
    stack: ["PHP", "MySQL", "Catálogo"],
    /*
     * Exportação estática do catálogo: o site corre em PHP+MySQL, que a Vercel
     * não aloja. A capa é o hero capturado a 1440 px — dentro da moldura o
     * iframe ao vivo abria em layout de telemóvel, com o cabeçalho partido.
     */
    link: { href: "https://autoshop-estatico.vercel.app/", label: "Ver o catálogo" },
    repo: {
      href: "https://github.com/sarynnec-spec/loja9952",
      label: "Ver no GitHub",
    },
    coverRatio: "page",
    coverAspect: "1440 / 639",
    cover: {
      src: "/media/web/autoshop-capa.jpg",
      alt: "Página inicial do AutoShop — stand de automóveis",
    },
  },
  {
    slug: "eco-sem-fio",
    index: "08",
    title: "ECO SEM FIO",
    category: "Website · Projeto Conceptual de Segurança Digital",
    description:
      "Marca fictícia criada como exercício: a ECO SEM FIO propõe testar a segurança da rede Wi-Fi de quem a visita. A landing page apresenta as soluções de proteção da ligação, explica o funcionamento em quatro passos e leva o visitante até ao teste da rede. Construída em HTML, CSS e JavaScript, sem framework.",
    highlights: [
      "Escudo em SVG animado, com gradientes e desfoque, como peça central do hero",
      "Campo de partículas em canvas, com linhas a ligar as que estão próximas",
      "Brilho a seguir o cursor, que cresce sobre os elementos interativos",
      "Ecrã de carregamento que dá início às animações de entrada, e revelação ao rolar",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Animação"],
    live: "https://eco-sem-fio.vercel.app/",
    link: { href: "https://eco-sem-fio.vercel.app/", label: "Ver o site" },
    coverRatio: "page",
    cover: {
      src: "/media/web/poster-eco-sem-fio.jpg",
      alt: "Página inicial do site ECO SEM FIO — internet segura",
    },
  },
  {
    slug: "rafalice",
    index: "09",
    title: "Salgados Rafalice",
    category: "Identidade · Social Media & Ads",
    description:
      "Identidade visual e peças promocionais para a marca: logotipo com mascote, poster de campanha e arte para redes sociais. Faço também a gestão das páginas e das campanhas de anúncios no Facebook e no Instagram.",
    stack: ["Identidade visual", "Gestão de páginas", "Facebook Ads", "Instagram Ads"],
    coverRatio: "square",
    /* O logótipo sobe para junto do nome — deixa de ser mais uma miniatura. */
    logo: {
      /* Recorte do PNG original: o quadrado trazia 16% de margem transparente
         em baixo, que desalinhava o selo do nome. */
      src: "/media/brand/rafalice-logo-trim.png",
      alt: "Logótipo Salgados Rafalice — mascote com chapéu de chefe",
    },
    cover: {
      src: "/media/brand/rafalice-poster.jpg",
      alt: "Poster promocional Salgados Rafalice",
    },
    galleryMode: "carousel",
    gallery: [
      {
        src: "/media/brand/rafalice-artesanais.jpg",
        alt: "Post “Salgados artesanais, feitos com amor”, com coxinhas e empadas em creme e dourado",
        caption: "Post · Salgados artesanais",
      },
      { src: "/media/brand/rafalice-poster.jpg", alt: "Poster 50 salgados por 20€", caption: "Poster de campanha" },
      { src: "/media/brand/rafalice-promo.jpg", alt: "Post promocional 50 salgadinhos", caption: "Post · Redes sociais" },
      {
        src: "/media/brand/rafalice-combo.jpg",
        alt: "Post com os dois pacotes: 50 salgados por 20€ e 50 salgados com 20 doces por 35€",
        caption: "Post · Pacotes 20€ e 35€",
      },
    ],
  },
  {
    slug: "nexus-industrial",
    index: "10",
    title: "NEXUS Industrial 3D",
    category: "Modelação e Visualização 3D · Unidade Fabril",
    description:
      "Representação tridimensional de uma nova unidade fabril para a Atlantic Tech Industries: modelação, materiais, iluminação e renderização em Blender. O estudo percorre as oito zonas funcionais, da produção e robótica ao armazém, logística e administração.",
    highlights: [
      "Implantação de 60 × 40 m e 12 m de altura, com 2 400 m² de área coberta",
      "Oito zonas funcionais modeladas: exterior, produção, robótica, qualidade e embalagem, armazém, logística, segurança e administração",
      "21 renderizações finais, com planta geral e anexo de verificação dimensional",
      "Materiais e paleta tirados do próprio modelo — sinalética, betão e carcaça de máquina",
    ],
    stack: ["Blender", "Modelação 3D", "Render", "Visualização industrial"],
    link: { href: "/projetos/nexus-industrial/", label: "Ver o estudo completo" },
    coverRatio: "laptop",
    cover: {
      src: "/media/web/nexus-capa.jpg",
      alt: "Vista aérea da unidade fabril modelada em 3D para a Atlantic Tech Industries",
    },
  },
];
