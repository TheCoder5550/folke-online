import styles from "./Header.module.css";
import logoUrl from "../../../logo.png";

const isProd = import.meta.env.PROD;
const isPages = window.location.hostname === "thecoder5550.github.io";

const BASE_PATH = isProd && isPages ?
  `${window.location.origin}/folke-online` :
  "";

export default function Header() {
  return (
    <header className={styles["header"]}>
      <a href={`${BASE_PATH}/`} className={styles["logo"]}>
        <img height="32" src={logoUrl}></img>
        <span>Folke Online</span>
      </a>

      <div className={styles["links"]}>
        <a href={`${BASE_PATH}/`}>Editor</a>
        <a href={`${BASE_PATH}/exercises/`}>Exercises</a>
        <a href={`${BASE_PATH}/guide/`}>Guide</a>
      </div>
    </header>
  )
}