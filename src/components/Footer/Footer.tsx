import styles from "./Footer.module.css";

const year = new Date().getUTCFullYear();

export default function Footer() {
  return (
    <footer className={styles["footer"]}>
      <span>&copy; {year} &nbsp;&ndash;&nbsp; The Folke Team</span>
      <a href="https://github.com/TheCoder5550/folke-online">View on GitHub</a>
    </footer>
  )
}