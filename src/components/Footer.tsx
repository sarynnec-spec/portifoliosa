import { profile } from "@/content/profile";
import LinkedInBadge from "./LinkedInBadge";
import LocalTime from "./LocalTime";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.name}>{profile.fullName}</p>
        <p className={styles.meta}>
          {profile.location} — <LocalTime />
        </p>
        <p className={styles.meta}>© {new Date().getFullYear()} · {profile.status}</p>
        <div className={styles.fim}>
          <LinkedInBadge />
          <a href="#topo" className={styles.top}>
            Voltar ao topo <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
