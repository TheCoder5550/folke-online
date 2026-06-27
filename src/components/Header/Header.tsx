import styles from "./Header.module.css";
import logoUrl from "../../../logo.png";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { toAbsURL } from "../../helpers/generic-helper";

export default function Header() {
  return (
    <header className={styles["header"]}>
      <a href={toAbsURL("./")} className={styles["logo"]}>
        <img height="32" src={logoUrl}></img>
        <span>Folke Online</span>
      </a>

      <div className={styles["links"]}>
        <a href={toAbsURL("./editor/")}>Editor</a>
        <a href={toAbsURL("./exercises/")}>Exercises</a>
        <a href={toAbsURL("./guide/")}>Guide</a>
      </div>

      <div className={styles["theme-toggle"]}>
        <DarkModeToggle />
      </div>
    </header>
  )
}