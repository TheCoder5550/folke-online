import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalProps = React.InputHTMLAttributes<HTMLDivElement> & React.PropsWithChildren & {
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
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0.25rem",
      background: "rgb(0, 0, 20, 0.4)",
      zIndex: "1000000000",
    }} onClick={handleClick} ref={backgroundRef}>
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "800px",
        height: "100%",
        maxHeight: "550px",
        background: "white",
        borderRadius: "2px",
        padding: "2.5rem 4rem",
        overflow: "auto",
        boxShadow: "0 1rem 4rem -2rem rgb(0, 0, 0, 0.5)"
      }}>
        {children}
        <button type="button" onClick={props.closeModal} style={{
          position: "absolute",
          right: "1rem",
          top: "1rem",
          background: "none",
          border: "none",
          fontWeight: "bold",
          fontFamily: "monospace"
        }}>✕</button>
      </div>
    </div>,
    document.body
  )
}