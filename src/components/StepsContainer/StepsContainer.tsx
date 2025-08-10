import { cls } from "../../helpers/generic-helper";
import styles from "./StepsContainer.module.css";

type StepsContainerProps = React.InputHTMLAttributes<HTMLDivElement> & React.PropsWithChildren;

export default function StepsContainer({ children, className, ...props }: StepsContainerProps) {
  return (
    <div className={cls(styles["steps-container"], className)} {...props}>
      {children}
    </div>
  )
}