import styles from "./Header.module.css";
import logoUrl from "../../../logo.png";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { getBasePath } from "../../helpers/generic-helper";

const BASE_PATH = getBasePath();

export default function Header() {
  return (
    <header className={styles["header"]}>
      <a href={`${BASE_PATH}/`} className={styles["logo"]}>
        <img height="32" src={logoUrl}></img>
        <span>Folke Online</span>
      </a>

      <div className={styles["links"]}>
        <a href={`${BASE_PATH}/editor/`}>Editor</a>
        <a href={`${BASE_PATH}/exercises/`}>Exercises</a>
        <a href={`${BASE_PATH}/guide/`}>Guide</a>
      </div>

      <div className={styles["theme-toggle"]}>
        <DarkModeToggle />
      </div>
    </header>
  )
}