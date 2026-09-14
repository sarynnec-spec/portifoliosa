# Estado do portefólio — 14 de setembro de 2026

Site pessoal da Sarynne Ferreira. **Live:** https://portifoliosarynne.vercel.app
(alias `portifoliosa.vercel.app`). Tudo o que está aqui em baixo já está publicado.

---

## Como publicar

A pasta **não é um repositório git**. Publica-se assim:

```bash
# 1. parar o servidor de desenvolvimento (porta 3100)
# 2. limpar a cache — obrigatório
rm -rf .next
npm run build
vercel --prod --yes
```

**Não correr `npm run build` com o `npm run dev` vivo.** Os dois partilham `.next` e o
resultado é `ChunkLoadError` e 404 nos chunks no browser. Aconteceu duas vezes.

---

## O que se fez nesta sessão

### Salgados Rafalice (projeto 08)
- **Logótipo ao lado do nome**, primeiro o logo. Usa `rafalice-logo-trim.png` — o PNG original
  trazia 16% de margem transparente em baixo, que o desalinhava do nome. Medido: o centro do
  selo e o centro do nome coincidem.
- **Galeria passou a carrossel de vidro** (`GlassCarousel`, variante `vidro`): blocos
  transparentes com a fotografia dentro, o do meio com um anel de laranja néon a girar
  (gradiente cónico animado por `@property --anel-ang`).
- **4 peças**, com *Salgados artesanais* em primeiro: artesanais, poster, promo, combo.
- A capa fixa saiu; o texto passou para baixo da animação.

### PULSE (projeto 04)
- Os 9 ecrãs passaram de miniaturas (~120 px) para a **variante `aparelho` do carrossel**:
  uma roda 3D. Cada peça a 40° da seguinte, raio de 1,7 larguras.
- **Sem laranja**, por pedido dela. O destaque é por profundidade de campo: o da frente nítido,
  ±1 com 1,4 px de desfoque, ±2 com 3,4 px.
- A conta que interessa na roda é a corda entre peças vizinhas, `2·R·sen(passo/2)`: tem de ser
  **maior do que a largura do aparelho**, senão os vizinhos trepam por cima do central.
  Medido: central 651–870 px, vizinho acaba aos 612 → 39 px de intervalo.

### Secção Motion (nova)
- Entrada própria na navegação, entre *Trabalho* e *Percurso*.
- Três vídeos verticais com ficha técnica (duração, formato, fps): reel de apresentação (17 s),
  Portugal em 30s, anúncio Rafalice.
- *Portugal em 30s* e *Anúncio Rafalice* **saíram** da lista de Trabalho para aqui; os projetos
  restantes foram renumerados de 01 a 08.

### Secção Sobre
- A fotografia ganhou **a revelação do reel**: quatro pontos nos cantos de uma caixa que morfa
  de larga-e-baixa para alta. Números tirados de
  `../zaask-agency-os/motion-studio/src/scenes/Revelacao.tsx` — 118%×36,4% → 100%, excesso de
  5,4% na largura antes de assentar, curva *smootherstep* `t³(6t²−15t+10)`, e a foto a entrar
  **a seco** aos 45% (no reel nada faz fade).
- **Traço laranja a correr o contorno** depois de a caixa assentar: `<rect>` em SVG com
  `stroke-dasharray`, um quinto do perímetro aceso de cada vez, 3,4 s por volta.
  `vector-effect: non-scaling-stroke` é obrigatório — sem ele o traço estica com a moldura.
- **Duas fotografias a revezar-se** de 5,2 em 5,2 s: `sarynne.png` e `retrato-estudio.jpg`.

### Rodapé
- Logótipo do LinkedIn na faixa preta, a abrir `linkedin.com/in/sarynne-coelho-ferreira`.
  (A plaquinha maior na secção de contacto foi experimentada e rejeitada.)

### Som da abertura
- Sintetizado em código (`src/lib/introSom.ts`), sem ficheiros: estalos afinados numa escala
  pentatónica para as pastilhas, sopros de ruído filtrado para as colunas, uma subida para a
  cortina. Os tempos espelham `Intro.module.css`.
- **Botão fixo no canto inferior direito**, "Abertura com som". Repete a abertura com som.
  A abertura em si continua a correr sozinha e em silêncio, como sempre correu.
- Uma **página de entrada** com "Bem-vindo" chegou a existir e foi **removida a pedido dela**.

### Desempenho
- Texturas do túnel reduzidas de 1200 px para 640 px: **207 MB → 59 MB** de memória gráfica.
  Era a maior carga da página e a causa provável do separador a fechar sozinho.
  `setPixelRatio` do túnel limitado a 1.5. Originais em `assets/tunel-originais/`.

---

## Por fazer

1. **Apagar `src/app/som/page.tsx`** — página de diagnóstico do áudio, criada para perceber
   porque é que o telemóvel não tocava. Já cumpriu; não está no menu nem ligada de lado nenhum.
2. **After Effects.** Não está escrito em lado nenhum do site, de propósito: os reels são
   Remotion e dizer AE seria falso. Se ela tiver trabalho real em AE, acrescentar uma peça à
   secção Motion com essa etiqueta. Em alternativa, fazer uma peça de raiz em AE — a sugestão
   foi refazer a revelação da fotografia, que já tem os tempos todos medidos.
3. **Etiquetas "Remotion" e "React"** nos três vídeos da secção Motion: ela ponderou tirá-las
   porque as vagas pedem AE. Ficaram. Decisão dela.
4. **Nomear clientes** na copy do LinkedIn — está por confirmar quais são clientes a sério e
   quais foram propostas ou estudos, antes de irem para um post público.
5. **Domínio** — chegou a falar em trocar para um endereço mais curto.

---

## Ficheiros para o LinkedIn

Em `C:\Users\saryn\Downloads\linkedin-reel\`:

| Ficheiro | O que é |
|---|---|
| `reel-sarynne-quadrado.mp4` | O reel em 1:1 (1920×1920), com as bandas na cor do próprio reel (`#F4F6F6`) — o compositor do LinkedIn encaixa o 9:16 numa janela larga e enche os lados de preto |
| `capa-quadrada.jpg` | Capa 1080×1080 a condizer |
| `capa-retrato-assinada.jpg` | Capa 9:16 com o retrato, nome e endereço |
| `capa-retrato-limpa.jpg` | A mesma, só a fotografia |
| `capa-1-trabalhos.jpg` · `capa-2-retrato.jpg` · `capa-3-cartao.jpg` | Fotogramas do reel |

**A capa é obrigatória:** os primeiros 1,3 s do reel são um retângulo branco quase vazio. Sem
capa própria, é isso que o LinkedIn mostra no feed.
