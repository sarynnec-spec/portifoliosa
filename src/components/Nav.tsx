"use client";

import { useEffect, useState } from "react";
import { navItems, profile } from "@/content/profile";
import styles from "./Nav.module.css";

export default function Nav() {
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  /* Estado "pinned": passa de sobreposto ao vídeo para barra sólida em papel. */
  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Secção ativa. */
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  /* Bloqueia o scroll do corpo enquanto o menu móvel está aberto. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className={styles.header} data-pinned={pinned || undefined} data-open={open || undefined}>
      <div className={styles.bar}>
        <a href="#topo" className={styles.mark} onClick={() => setOpen(false)}>
          <span className={styles.markName}>
            {profile.firstName} {profile.lastName}
          </span>
          <span className={styles.markRole}>{profile.roleShort}</span>
        </a>

        <nav className={styles.links} aria-label="Navegação principal">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={styles.link}
              data-active={active === item.id || undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href={`mailto:${profile.email}`} className={styles.cta}>
          Entrar em contacto
        </a>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="menu-movel"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={styles.sheet} id="menu-movel" hidden={!open}>
        <nav className={styles.sheetNav} aria-label="Navegação">
          {navItems.map((item, i) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={styles.sheetLink}
              style={{ transitionDelay: `${0.06 * i + 0.08}s` }}
              onClick={() => setOpen(false)}
            >
              <span className={styles.sheetIndex}>{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.sheetFoot}>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.whatsapp} target="_blank" rel="noopener">
            {profile.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
