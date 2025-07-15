import styles from "./StepsContainer.module.css";

export default function StepsContainer({ children }: React.PropsWithChildren) {
  return (
    <div className={styles["steps-container"]}>
      {children}
    </div>
  )
}