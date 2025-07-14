import styles from "./ProofBox.module.css"

export default function ProofBox({ children }: React.PropsWithChildren) {
  return (
    <div className={styles["proof-box"]}>
      {children}
    </div>
  )
}