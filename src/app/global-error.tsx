"use client";

import { useEffect, useState } from "react";

/**
 * Rede de segurança para o ecrã «Application error».
 *
 * O caso que a trouxe: cada publicação gera ficheiros de JavaScript com nomes
 * novos, e os da publicação anterior deixam de existir — medido, o
 * `page-56be527f…js` da versão de antes devolve 404. Um separador que já
 * estivesse aberto continua a pedir os antigos, não os encontra, e a página
 * não consegue arrancar. Quem está do outro lado vê só «Application error» e
 * uma página em branco, sem ter feito nada de errado.
 *
 * Recarregar resolve sempre, porque o HTML revalida a cada pedido
 * (`max-age=0, must-revalidate`) e traz os nomes novos. Então recarrega-se
 * sozinho, **uma vez**, em vez de a pessoa ter de adivinhar que era isso.
 *
 * ⚠️ A marca fica em `sessionStorage` e é isso que impede o pior cenário:
 * se o erro for outro, e não os ficheiros, a página voltaria a falhar e a
 * recarregar em ciclo. Com a marca, à segunda mostra-se a mensagem e
 * entrega-se o botão a quem está a ver.
 *
 * ⚠️ Isto só protege das publicações **seguintes** — o separador já partido
 * está a correr o código antigo, que ainda não tem esta rede.
 */

const MARCA = "recarga-apos-erro";

export default function GlobalError({ reset }: { reset: () => void }) {
  const [desisti, setDesisti] = useState(false);

  useEffect(() => {
    let jaTentou = false;
    try {
      jaTentou = sessionStorage.getItem(MARCA) === "1";
      if (!jaTentou) sessionStorage.setItem(MARCA, "1");
    } catch {
      /* Armazenamento bloqueado: sem marca não se pode arriscar o ciclo. */
      jaTentou = true;
    }

    if (jaTentou) {
      setDesisti(true);
      return;
    }

    window.location.reload();
  }, []);

  return (
    <html lang="pt-PT">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "grid",
          placeItems: "center",
          gap: "1rem",
          background: "#14130f",
          color: "#f0ece3",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <p style={{ margin: "0 0 1.25rem", lineHeight: 1.6 }}>
            {desisti
              ? "Não foi possível carregar a página."
              : "A recarregar a página…"}
          </p>
          {desisti && (
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.removeItem(MARCA);
                } catch {
                  /* Sem armazenamento, o botão recarrega à mesma. */
                }
                reset();
                window.location.reload();
              }}
              style={{
                font: "inherit",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                padding: "0.7rem 1.4rem",
                color: "#fff",
                background: "#c2481f",
                border: 0,
                cursor: "pointer",
              }}
            >
              Tentar outra vez
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
