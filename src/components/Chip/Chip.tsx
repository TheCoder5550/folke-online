import styles from "./Chip.module.css";

type ChipProps = React.PropsWithChildren;

export default function Chip({ children }: ChipProps) {
  return (
    <span className={styles["chip"]}>
      {children}
    </span>
  )
}