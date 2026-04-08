import styles from "./Modal.module.css";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export type ModalProps = React.InputHTMLAttributes<HTMLDivElement> & React.PropsWithChildren & {
  open: boolean;
  closeModal: () => void;
};

export default function Modal({ children, ...props }: ModalProps) {
  const backgroundRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (props.open) {
      document.body.style.overflow = "hidden"
    }
    else {
      document.body.style.overflow = "";
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        props.closeModal();
      }
    }

    if (props.open) {
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
    }
  }, [ props.open ]);

  if (!props.open) {
    return undefined;
  }

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!backgroundRef.current) {
      return;
    }

    if (e.target === backgroundRef.current) {
      props.closeModal();
    }
  }

  return createPortal(
    <div className={styles["modal-background"]} onClick={handleClick} ref={backgroundRef}>
      <div className={styles["modal"]}>
        {children}
        <button type="button" onClick={props.closeModal} className="close-button">✕</button>
      </div>
    </div>,
    document.body
  )
}