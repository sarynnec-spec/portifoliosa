import styles from "./LogoMarquee.module.css";

/**
 * Faixa de logos em movimento contínuo, no mesmo princípio do <Marquee/>:
 * o grupo é duplicado para o ciclo fechar sem salto (translate de -50%).
 * Cada logo vive numa célula de tamanho fixo e entra em `contain`, para
 * todos ficarem com a mesma presença visual apesar dos rácios diferentes.
 */
const tools = [
  { name: "Figma", file: "figma.webp" },
  { name: "Photoshop", file: "photoshop.webp" },
  { name: "Illustrator", file: "illustrator.webp" },
  { name: "After Effects", file: "after-effects.webp" },
  { name: "Blender", file: "blender.webp" },
  { name: "Photopea", file: "photopea.webp" },
  { name: "Canva", file: "canva.webp" },
  { name: "VS Code", file: "vs-code.webp" },
  { name: "Vercel", file: "vercel.webp" },
  { name: "Supabase", file: "supabase.webp" },
  { name: "WordPress", file: "wordpress.webp" },
  { name: "Claude", file: "claude.webp" },
  { name: "Awwwards", file: "awwwards.webp" },
  { name: "Meta Ads", file: "meta.webp" },
  { name: "Google Ads", file: "google-ads.webp" },
];

export default function LogoMarquee() {
  const group = (
    <div className={styles.group} aria-hidden="true">
      {tools.map((tool) => (
        <div className={styles.cell} key={tool.file}>
          <img
            className={styles.logo}
            src={`/ferramentas/${tool.file}`}
            alt=""
            width={128}
            height={64}
            decoding="async"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.bar}>
      <p style={{ position: "absolute", left: "-9999px" }}>
        Ferramentas: {tools.map((tool) => tool.name).join(", ")}
      </p>
      <div className={styles.track}>
        {group}
        {group}
      </div>
    </div>
  );
}
