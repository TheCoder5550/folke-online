import { useShallow } from "zustand/shallow";
import useContextMenuStore from "../../stores/context-menu-store";
import styles from "./ContextMenu.module.css";
import { useEffect, useRef } from "react";
import { cls } from "../../helpers/generic-helper";

export default function ContextMenu() {
  const isOpen = useContextMenuStore((state) => state.isOpen);
  const items = useContextMenuStore(useShallow((state) => state.items));
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const close = useContextMenuStore((state) => state.close);
  const xOffset = useContextMenuStore((state) => state.xOffset);
  const yOffset = useContextMenuStore((state) => state.yOffset);

  const backgroundRef = useRef<HTMLDivElement | null>(null);

  const handleMouse: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!backgroundRef.current) {
      return;
    }

    if (e.target === backgroundRef.current) {
      close();
    }

    e.preventDefault();
  }

  useEffect(() => {
    const onScroll = () => {
      close();
    }

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    }
  });

  if (!isOpen) {
    return <></>
  }

  return (
    <div
      className={styles["container"]}
      onContextMenu={e => e.preventDefault()}
      onMouseDown={handleMouse}
      ref={backgroundRef}
    >
      <div className={styles["menu"]} style={{
        top: `${yOffset + 4}px`,
        left: `${xOffset + 4}px`,
      }}>
        {items.map(item => (
          <button
            type="button"
            className={cls(styles["menu-item"], item.type === "danger" && styles["danger"])}
            key={item.label}
            onClick={() => {
              item.action();
              close();
            }}
            disabled={!(item.enabled ?? true)}
          >
            {item.icon}
            <div className={styles["item-text"]}>
              <span>{item.label}</span>
              <span>{item.shortcut}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}