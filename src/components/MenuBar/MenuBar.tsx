/* eslint-disable react-x/no-array-index-key */

import { memo, useEffect, useRef, useState, type JSX } from "react";
import styles from "./MenuBar.module.css";
import { cls } from "../../helpers/generic-helper";
import { FaChevronRight } from "react-icons/fa";
import { showKeybind, showKeybindName, type Keybind, type KeybindId } from "../../helpers/keybinds";

export type MenuBarData = MenuBarItem[];

export interface MenuBarItem {
  label: string;
  icon?: JSX.Element;
  danger?: boolean;
  children?: MenuBarItem[];
  action?: () => boolean | void;
  enabled?: boolean;
  shortcut?: KeybindId | Keybind;
}

interface MenuBarProps {
  data: MenuBarData;
  above?: boolean;
}

export default function MenuBar(props: MenuBarProps) {
  const menuBarRef = useRef<HTMLDivElement>(null);
  const [openState, setOpenState] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);

  const anyOpen = openState !== null;

  // Press outside to close menu
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!menuBarRef.current) {
        return;
      }

      const pressedInside = menuBarRef.current.contains(event.target as Node);
      if (!pressedInside && anyOpen) {
        closeAll();
      }
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    }
  }, [ openState, menuBarRef.current ]);

  const closeAll = () => {
    setOpenState(null);
    setOffset(0);
  }

  const toggleOpen = (buttonIndex: number) => {
    if (openState === buttonIndex) {
      handleOpen(null);
    }
    else {
      handleOpen(buttonIndex);
    }
  }

  const handleOpen = (buttonIndex: number | null) => {
    setOpenState(buttonIndex);

    const menuBar = menuBarRef.current;
    if (!menuBar) {
      return;
    }

    if (buttonIndex === null) {
      return;
    }

    const activeMenuButton = menuBar.children[buttonIndex];
    if (!activeMenuButton) {
      return;
    }

    const parentBR = menuBar.getBoundingClientRect();
    const childBR = activeMenuButton.getBoundingClientRect();
    const newOffset = childBR.left - parentBR.left;
    setOffset(newOffset);
  };

  const style = props.above === true ? {
    top: "0",
    transform: `translateY(-100%) translateX(${offset}px)`,
  } : {
    bottom: "0",
    transform: `translateY(100%) translateX(${offset}px)`,
  };

  return (
    <div className={styles["menubar"]} ref={menuBarRef}>
      {props.data.map((item, index) => (
        <button
          key={index}
          type="button"
          className={cls(styles["menu-button"], openState === index && styles["active"])}
          onClick={() => toggleOpen(index)}
          onMouseEnter={() => {
            if (anyOpen) {
              handleOpen(index)
            }
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}

      {openState !== null && props.data[openState].children && (
        <DropdownMemo
          key={openState}
          style={{
            left: "0",
            ...style
          }}
          items={props.data[openState].children}
          closeAll={closeAll}
          preventParentChange={() => {}}
        />
      )}
    </div>
  )
}

type DropdownProps = React.ButtonHTMLAttributes<HTMLDivElement> & {
  items: MenuBarItem[];
  closeAll: () => void;
  preventParentChange: () => void;
}

const DropdownMemo = memo(Dropdown);

function Dropdown({ items, closeAll, preventParentChange, ...props }: DropdownProps) {
  const SMOOTH_TIME = 75;

  const itemsRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [openState, setOpenState] = useState<number | null>(null);
  const [openStateRendered, setOpenStateRendered] = useState<number | null>(null);
  const [dontChange, setDontChange] = useState(false);

  // Compute smoothed openState
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (dontChange) {
        setOpenState(openStateRendered);
        return;
      }

      setOpenStateRendered(openState);

      const dropdown = itemsRef.current;
      if (!dropdown) {
        return;
      }

      if (openState === null) {
        return;
      }

      const activeMenuButton = dropdown.children[openState];
      if (!activeMenuButton) {
        return;
      }

      const parentBR = dropdown.getBoundingClientRect();
      const childBR = activeMenuButton.getBoundingClientRect();
      const newOffset = childBR.top - parentBR.top;
      setOffset(newOffset);
    }, SMOOTH_TIME);

    return () => {
      clearTimeout(timeout);
    }
  }, [ openState, dontChange ])

  const handleOpen = (index: number) => {
    let nextOpenState: number | null = index;
    if (items[index].children === undefined || items[index].enabled === false) {
      nextOpenState = null;
    }

    setOpenState(nextOpenState);
    setDontChange(false);
    preventParentChange();
  }

  return (
    <div
      {...props}
      className={cls(styles["dropdown-container"], props.className)}
      style={{
        ...props.style,
      }}
    >
      <div
        ref={itemsRef}
        className={styles["dropdown"]}
      >
        {items.map((child, index) => (
          <button
            key={index}
            type="button"
            className={cls(
              styles["dropdown-button"],
              child.danger && styles["danger"],
              openState === index && styles["active"],
              child.enabled === false && styles["disabled"]
            )}
            onMouseEnter={() => handleOpen(index)}
            onClick={() => {
              if (child.action && child.enabled !== false) {
                const res = child.action();
                if (res !== false) {
                  closeAll();
                }
              }
            }}
          >
            {child.icon ?? <span></span>}
            <span>{child.label}</span>
            {child.children ? (
              <FaChevronRight />
            ) : (
              <span>{showShortcut(child.shortcut)}</span>
            )}
          </button>
        ))}
      </div>

      {openStateRendered !== null && items[openStateRendered]?.children && (
        <DropdownMemo
          key={openStateRendered}
          style={{
            transform: `translateX(100%) translateY(${offset}px)`,
          }}
          items={items[openStateRendered].children}
          closeAll={closeAll}
          preventParentChange={() => setDontChange(true)}
        />
      )}
    </div>
  )
}

function showShortcut(shortcut: KeybindId | Keybind | undefined): string {
  if (typeof shortcut === "undefined") {
    return "";
  }

  if (typeof shortcut === "string") {
    return showKeybindName(shortcut);
  }

  return showKeybind(shortcut);
}