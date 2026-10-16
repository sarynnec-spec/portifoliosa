"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GlassCarousel from "./GlassCarousel";
import Lightbox from "./Lightbox";
import Reveal from "./Reveal";
import {
  IconeFacebook,
  IconeGoogle,
  IconeInstagram,
  IconeMeta,
  IconeTikTok,
} from "./IconesRedes";
import { clientes, pecasClientes } from "@/content/clientes";
import styles from "./Clientes.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONES = {
  instagram: IconeInstagram,
  facebook: IconeFacebook,
  meta: IconeMeta,
  tiktok: IconeTikTok,
  google: IconeGoogle,
} as const;

const NOMES = {
  instagram: "Instagram",
  facebook: "Facebook",
  meta: "Meta Ads",
  tiktok: "TikTok",
  google: "Google",
} as const;

/**
 * Clientes: a peça de um lado, o que foi entregue do outro.
 *
 * O carrossel é o MESMO `GlassCarousel` das galerias dos projetos, com o
 * mesmo movimento — foi o que ela pediu («pode ser passando manter o mesmo
 * movimento que esta»). Não se reescreveu nada dele: só passou a avisar
 * quem está de fora qual é a peça ao centro, por um `onAtivoChange` que é
 * opcional e que mais ninguém usa.
 *
 * A lista da direita segue a peça em foco: ao passar da Rafalice para a
 * Valentina, muda a lista com ela.
 */
export default function Clientes() {
  const [ativo, setAtivo] = useState(0);
  const [aberta, setAberta] = useState<number | null>(null);

  /*
   * `useCallback` não é enfeite: o `onAtivoChange` entra num `useEffect` lá
   * dentro, e uma função nova a cada render punha esse efeito a correr sem
   * parar.
   */
  const aoMudar = useCallback((i: number) => setAtivo(i), []);

  const peca = pecasClientes[ativo];
  const cliente = clientes.find((c) => c.slug === peca.cliente) ?? clientes[0];

  /* Quantas peças deste cliente — para a ficha dizer o que está a mostrar. */
  const doCliente = pecasClientes.filter((p) => p.cliente === cliente.slug).length;

  return (
    <section className={`section ${styles.section}`} id="clientes">
      <div className="container">
        <header className={styles.head}>
          <Reveal as="p" className="eyebrow">
            Clientes
          </Reveal>
          <Reveal as="h2" className={`display ${styles.title}`} delay={0.06}>
            <em>Gestão de redes sociais</em> e anúncios para cada marca
          </Reveal>
          <Reveal as="p" className={`lede ${styles.lede}`} delay={0.1}>
            Páginas geridas e campanhas a correr no Instagram, no Facebook, no TikTok e no
            gestor da Meta, com o conteúdo preparado para ser encontrado na pesquisa. As
            peças passam sozinhas e a ficha acompanha-as: fica sempre a da marca da peça
            que está à frente.
          </Reveal>
        </header>

        <div className={styles.palco}>
          <div className={styles.colEsquerda}>
            <div className={styles.carrossel}>
              <GlassCarousel
                images={pecasClientes}
                onOpen={setAberta}
                onAtivoChange={aoMudar}
                label="Peças criadas para clientes"
              />
            </div>

            {/* O que as configurações trazem, POR BAIXO DAS IMAGENS — foi
                onde ela o quis. Na coluna da direita, somado às entregas, a
                lista ia a dez linhas e o que foi mesmo produzido deixava de
                se destacar. */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${cliente.slug}-alcance`}
                className={styles.alcance}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <p className={styles.rotulo}>O que isso traz</p>
                <ul className={styles.alcanceLista}>
                  {cliente.alcance.map((linha) => (
                    <li key={linha}>{linha}</li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={cliente.slug}
              className={styles.ficha}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* O logótipo encabeça a ficha, como já acontece nos projetos:
                  deixa de ser mais uma miniatura e passa a identificar a marca. */}
              <img className={styles.logo} src={cliente.logo.src} alt={cliente.logo.alt} />

              <h3 className={styles.nome}>{cliente.nome}</h3>
              <p className={styles.contexto}>{cliente.contexto}</p>

              {/* As redes vêm antes da lista, e não no fim: é o trabalho que
                  ela quer em destaque nos dois clientes. */}
              <ul className={styles.redes} aria-label="Redes geridas">
                {cliente.redes.map((rede) => {
                  const Icone = ICONES[rede];
                  return (
                    <li key={rede}>
                      <Icone className={styles.redeIcone} />
                      <span>{NOMES[rede]}</span>
                    </li>
                  );
                })}
              </ul>

              <p className={styles.rotulo}>O que foi feito</p>
              <ul className={styles.entregas}>
                {cliente.entregas.map((entrega) => (
                  <li key={entrega}>{entrega}</li>
                ))}
              </ul>

              <p className={styles.contagem}>
                {doCliente} {doCliente === 1 ? "peça mostrada" : "peças mostradas"}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Lightbox
        images={pecasClientes}
        index={aberta}
        onClose={() => setAberta(null)}
        onIndexChange={setAberta}
      />
    </section>
  );
}
