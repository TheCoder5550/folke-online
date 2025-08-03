import { cls } from "../../helpers/generic-helper";
import styles from "./ToggleButton.module.css";
import type { PropsWithChildren } from "react"

type ToggleButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren & {
  toggled: boolean;
  toggle: () => void;
}

export default function ToggleButton({ children, toggled, toggle, ...props }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={() => toggle()}
      className={cls("action-button", styles["toggle-button"], toggled && styles["toggled"])}
      {...props}
    >
      {children}
    </button>
  )
}