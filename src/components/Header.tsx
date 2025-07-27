import { GiPlagueDoctorProfile } from "react-icons/gi";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles["header"]}>
      <div className={styles["logo"]}>
        <GiPlagueDoctorProfile size="2rem" />
        <span>Folke Online</span>
      </div>

      <div className={styles["links"]}>
        <a href="/">Editor</a>
        <a href="/exercises/">Exercises</a>
      </div>
    </header>
  )
}