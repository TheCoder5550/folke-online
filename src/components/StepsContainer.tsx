import styles from "./StepsContainer.module.css";

type StepsContainerProps = React.InputHTMLAttributes<HTMLDivElement> & React.PropsWithChildren;

export default function StepsContainer({ children, ...props }: StepsContainerProps) {
  return (
    <div className={styles["steps-container"]} {...props}>
      {children}
    </div>
  )
}