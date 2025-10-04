/* eslint-disable react-x/no-array-index-key */

import { memo, useEffect, useRef, useState, type JSX } from "react";
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

// export default function MenuBar(props: MenuBarProps) {
//   const SMOOTH_TIME = 100;

//   const menuBarRef = useRef<HTMLDivElement>(null);
//   const [openState, setOpenState] = useState<number[]>([]);
//   const [openStateRendered, setOpenStateRendered] = useState<number[]>([]);
//   const [offset, setOffset] = useState(0);

//   // Compute smoothed openState
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setOpenStateRendered(openState);
//     }, SMOOTH_TIME);

//     return () => {
//       clearTimeout(timeout);
//     }
//   }, [ openState ])

//   // Press outside to close menu
//   useEffect(() => {
//     const onClick = (event: MouseEvent) => {
//       if (!menuBarRef.current) {
//         return;
//       }

//       const pressedInside = menuBarRef.current.contains(event.target as Node);
//       if (!pressedInside && openState.length !== 0) {
//         closeAll();
//       }
//     };

//     document.addEventListener("click", onClick);
//     return () => {
//       document.removeEventListener("click", onClick);
//     }
//   }, [ openState, menuBarRef.current ]);

//   const anyOpen = openState.length !== 0;

//   const closeAll = () => {
//     setOpenState([]);
//     setOffset(0);
//   }

//   const toggleOpen = (buttonIndex: number, nestLevel: number) => {
//     if (openState[nestLevel] === buttonIndex) {
//       handleOpen(null, nestLevel);
//     }
//     else {
//       handleOpen(buttonIndex, nestLevel);
//     }
//   }

//   const handleOpen = (buttonIndex: number | null, nestLevel: number) => {
//     let newOpen = openStateRendered.slice(0, nestLevel);
//     if (buttonIndex !== null) {
//       newOpen[nestLevel] = buttonIndex;
//     }
//     const hasChildren = getMenuBarItem(props.data, newOpen).children;
//     if (!hasChildren) {
//       newOpen = newOpen.slice(0, nestLevel);
//     }
//     setOpenState(newOpen);
//     if (nestLevel === 0) {
//       setOpenStateRendered(newOpen.slice());
//     }

//     const menuBar = menuBarRef.current;
//     if (!menuBar) {
//       return;
//     }

//     const activeMenuButton = menuBar.children[newOpen[0]];
//     if (!activeMenuButton) {
//       return;
//     }

//     const parentBR = menuBar.getBoundingClientRect();
//     const childBR = activeMenuButton.getBoundingClientRect();
//     const newOffset = childBR.left - parentBR.left;
//     setOffset(newOffset);
//   };

//   return (
//     <div className={styles["menubar"]} ref={menuBarRef}>
//       {props.data.map((item, index) => (
//         <button
//           key={index}
//           type="button"
//           className={cls(styles["menu-button"], openState[0] === index && styles["active"])}
//           onClick={() => toggleOpen(index, 0)}
//           onMouseEnter={() => {
//             if (anyOpen) {
//               handleOpen(index, 0)
//             }
//           }}
//         >{item.label}</button>
//       ))}

//       {openStateRendered.map((_, nestLevel) => (
//         <div
//           key={nestLevel}
//           className={styles["dropdown"]}
//           style={{
//             transform: `translateY(100%) translateX(calc(${offset}px + ${nestLevel * 100}%))`
//           }}
//         >
//           {getMenuBarItem(props.data, openStateRendered.slice(0, nestLevel + 1))?.children?.map((child, index) => (
//             <button
//               key={index}
//               type="button"
//               className={cls(
//                 styles["dropdown-button"],
//                 child.danger && styles["danger"],
//                 openState[nestLevel + 1] === index && styles["active"]
//               )}
//               onMouseEnter={() => handleOpen(index, nestLevel + 1)}
//               onClick={() => {
//                 if (child.action) {
//                   const res = child.action();
//                   if (res !== false) {
//                     closeAll();
//                   }
//                 }
//               }}
//             >
//               {child.icon ?? <span></span>}
//               <span>{child.label}</span>
//               {child.children && (
//                 <FaChevronRight />
//               )}
//             </button>
//           ))}
//         </div>
//       ))}
//     </div>
//   )
// }

// function getMenuBarItem(data: MenuBarData, path: number[]): MenuBarItem {
//   let item: MenuBarItem = {
//     label: "",
//     children: data
//   };

//   path = path.slice();

//   while (path.length > 0) {
//     const buttonIndex = path.shift()!;
//     if (!item.children) {
//       throw new Error();
//     }
//     item = item.children[buttonIndex];
//   }

//   return item;
// }

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
        >{item.label}</button>
      ))}

      {openState !== null && props.data[openState].children && (
        <DropdownMemo
          key={openState}
          style={{
            bottom: "0",
            left: "0",
            transform: `translateY(100%) translateX(${offset}px)`,
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
    if (items[index].children === undefined) {
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
      <div ref={itemsRef} className={styles["dropdown"]}>
        {items.map((child, index) => (
          <button
            key={index}
            type="button"
            className={cls(
              styles["dropdown-button"],
              child.danger && styles["danger"],
              openState === index && styles["active"]
            )}
            onMouseEnter={() => handleOpen(index)}
            onClick={() => {
              if (child.action) {
                const res = child.action();
                if (res !== false) {
                  closeAll();
                }
              }
            }}
          >
            {child.icon ?? <span></span>}
            <span>{child.label}</span>
            {child.children && (
              <FaChevronRight />
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