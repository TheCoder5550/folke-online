/* eslint-disable react-x/no-array-index-key */

import { useEffect, useRef, useState, type JSX } from "react";
import styles from "./MenuBar.module.css";
import { cls } from "../../helpers/generic-helper";
import { FaChevronRight } from "react-icons/fa";

export type MenuBarData = MenuBarItem[];

export interface MenuBarItem {
  label: string;
  icon?: JSX.Element;
  danger?: boolean;
  children?: MenuBarItem[];
  action?: () => boolean | void;
}

interface MenuBarProps {
  data: MenuBarData;
}

export default function MenuBar(props: MenuBarProps) {
  const menuBarRef = useRef<HTMLDivElement>(null);
  const [openState, setOpenState] = useState<number[]>([]);
  const [offset, setOffset] = useState(0);
  // const [offsets, setOffsets] = useState<number[]>([]);

  // Press outside to close menu
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!menuBarRef.current) {
        return;
      }

      const pressedInside = menuBarRef.current.contains(event.target as Node);
      if (!pressedInside) {
        closeAll();
      }
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    }
  }, []);

  const anyOpen = openState.length !== 0;

  const closeAll = () => {
    setOpenState([]);
    setOffset(0);
  }

  const toggleOpen = (buttonIndex: number, nestLevel: number) => {
    if (openState[nestLevel] === buttonIndex) {
      handleOpen(null, nestLevel);
    }
    else {
      handleOpen(buttonIndex, nestLevel);
    }
  }

  const handleOpen = (buttonIndex: number | null, nestLevel: number) => {
    let newOpen = openState.slice(0, nestLevel);
    if (buttonIndex !== null) {
      newOpen[nestLevel] = buttonIndex;
    }
    const hasChildren = getMenuBarItem(props.data, newOpen).children;
    if (!hasChildren) {
      newOpen = newOpen.slice(0, nestLevel);
    }
    setOpenState(newOpen);

    const menuBar = menuBarRef.current;
    if (!menuBar) {
      return;
    }

    const activeMenuButton = menuBar.children[newOpen[0]];
    if (!activeMenuButton) {
      return;
    }

    const parentBR = menuBar.getBoundingClientRect();
    const childBR = activeMenuButton.getBoundingClientRect();
    const newOffset = childBR.left - parentBR.left;
    setOffset(newOffset);
  };

  return (
    <div className={styles["menubar"]} ref={menuBarRef}>
      {props.data.map((item, index) => (
        <button
          key={index}
          type="button"
          className={cls(styles["menu-button"], openState[0] === index && styles["active"])}
          onClick={() => toggleOpen(index, 0)}
          onMouseEnter={() => {
            if (anyOpen) {
              handleOpen(index, 0)
            }
          }}
        >{item.label}</button>
      ))}

      {openState.map((_, nestLevel) => (
        <div
          key={nestLevel}
          className={styles["dropdown"]}
          style={{
            transform: `translateY(100%) translateX(calc(${offset}px + ${nestLevel * 100}%))`
          }}
        >
          {getMenuBarItem(props.data, openState.slice(0, nestLevel + 1))?.children?.map((child, index) => (
            <button
              key={index}
              type="button"
              className={cls(
                styles["dropdown-button"],
                child.danger && styles["danger"],
                openState[nestLevel + 1] === index && styles["active"]
              )}
              onMouseEnter={() => handleOpen(index, nestLevel + 1)}
              onClick={() => {
                if (child.action) {
                  const res = child.action();
                  if (res !== false) {
                    closeAll();
                  }
                }
              }}
            >
              {child.icon}
              <span>{child.label}</span>
              {child.children && (
                <FaChevronRight />
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

function getMenuBarItem(data: MenuBarData, path: number[]): MenuBarItem {
  let item: MenuBarItem = {
    label: "",
    children: data
  };

  path = path.slice();

  while (path.length > 0) {
    const buttonIndex = path.shift()!;
    if (!item.children) {
      throw new Error();
    }
    item = item.children[buttonIndex];
  }

  return item;
}