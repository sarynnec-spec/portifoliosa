import Marquee from "./Marquee";
import { disciplines } from "@/content/profile";
import styles from "./Entrada.module.css";

/**
 * As disciplinas de design, escritas por cima do baloiço.
 *
 * Na referência (o portfólio da Debbie) elas vão escritas na viga preta de
 * onde os baloiços pendem. A imagem que ela escolheu não tem viga — é uma
 * prancha única com duas cordas — por isso ficam no laranja vazio por cima,
 * que a imagem tem de sobra (medido: os 41% de cima estão livres).
 *
 * Só as de design, porque foi o que ela pediu para esta entrada. Todas
 * constam da lista `disciplines` do perfil; nada aqui é novo.
 */
const NA_VIGA = ["UX/UI Design", "Identidade Visual", "Motion Design", "Web Design"];

export default function Entrada() {
  return (
    <section className={styles.entrada}>
      {/*
        A banda é a imagem do baloiço. Era um vídeo e ela trocou-a por esta
        imagem — que, por ser chapada no topo (medido: RGB 253,112,0 com
        desvio ~1), resolve de vez a emenda que o vídeo dava: não há vinheta
        para imitar, basta a mesma cor no espaço que livra a navegação.
      */}
      <div className={styles.banda}>
        <div className={styles.palco}>
          <img
            className={styles.imagem}
            src="/media/web/entrada-baloico.webp"
            alt=""
            aria-hidden="true"
            width={2752}
            height={1536}
            fetchPriority="high"
          />
          <p className={styles.viga}>
            {NA_VIGA.map((d, i) => (
              <span key={d}>
                {d}
                {i < NA_VIGA.length - 1 && <i className={styles.losango} aria-hidden="true" />}
              </span>
            ))}
          </p>
          {/*
            🔴 Era um <h1> quando esta secção abria a página. Agora ela vive a
            meio, depois do <Hero />, que já tem o <h1> do nome — dois <h1>
            partiam o esqueleto do documento. Passou a <h2>, e continua
            escondido (não há classe `sr-only` neste projeto; pu-la uma vez e
            o título apareceu em letras brancas sobre o laranja).
          */}
          <h2 style={{ position: "absolute", left: "-9999px" }}>
            Portefólio — o trabalho
          </h2>
        </div>
      </div>

      <div className={`container ${styles.corpo}`}>
        {/* A frase que ela pediu, em branco sobre o laranja, por baixo do baloiço. */}
        <blockquote className={styles.citacao}>
          <p>&ldquo;Good design is as little design as possible.&rdquo;</p>
          <cite>— Dieter Rams</cite>
        </blockquote>

        <p className={styles.frase}>Onde o design encontra a tecnologia.</p>

        <p className={styles.sub}>
          Sou a Sarynne. Trabalho identidade visual, interfaces e motion graphics — e
          construo em código o que desenho.
        </p>

        <div className={styles.botoes}>
          <a className={styles.primario} href="#trabalho">
            Ver o trabalho
            <span aria-hidden="true">→</span>
          </a>
          <a className={styles.secundario} href="#contacto">
            Entrar em contacto
          </a>
        </div>
      </div>

      {/*
        A mesma faixa que já existe no site, não uma cópia dela.

        Na referência esta barra é PRETA, e aqui tinha de o ser também: a
        Marquee pinta-se com `--accent` (#c2481f), que ao lado deste laranja
        ficava laranja sobre laranja. Em vez de lhe mexer, a secção troca a
        variável — o componente fica igual para quem o usa noutro sítio.
      */}
      <div className={styles.faixa}>
        <Marquee items={disciplines} />
      </div>
    </section>
  );
}
