import styles from "./ProofContainer.module.css";

export default function ProofContainer({ children }: React.PropsWithChildren) {
  return (
    <div className={styles["proof-container"]}>
      {children}
    </div>
  )
}