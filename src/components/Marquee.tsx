import styles from "./Marquee.module.css";

/**
 * Faixa em movimento contínuo. O conteúdo é duplicado para o ciclo
 * fechar sem salto (translate de -50%).
 */
export default function Marquee({ items }: { items: string[] }) {
  const group = (
    <div className={styles.group} aria-hidden="true">
      {items.map((item, i) => (
        <span className={styles.item} key={`${item}-${i}`}>
          {item}
          <span className={styles.dot} />
        </span>
      ))}
    </div>
  );

  return (
    <div className={styles.marquee}>
      <p className="sr-only" style={{ position: "absolute", left: "-9999px" }}>
        {items.join(", ")}
      </p>
      <div className={styles.track}>
        {group}
        {group}
      </div>
    </div>
  );
}
