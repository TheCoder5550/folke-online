import { useEffect, useRef, useState } from "react";
import styles from "./AutocompleteInput.module.css";
import { clamp } from "../helpers/generic-helper";

export interface Suggestion {
  label: string;
  value: string;
}

export type AutocompleteInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  containerClassName?: string;
  suggestions: Suggestion[];
  value: string;
  onSelectItem: (item: Suggestion) => void;
}

export default function AutocompleteInput(props: AutocompleteInputProps) {
  const {
    containerClassName,
    suggestions,
    onSelectItem,
    ...inputProps
  } = props;

  const [listVisible, setListVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const matchingSuggestions = suggestions.filter(s => s.label.includes(props.value));
  if (matchingSuggestions.length === 0) {
    matchingSuggestions.push({
      label: "Unknown rule: " + props.value,
      value: props.value
    });
  }

  const focus: React.FocusEventHandler<HTMLInputElement> = (e) => {
    setListVisible(true);
    setSelectedIndex(0);
    return props.onFocus?.(e);
  };

  const blur: React.FocusEventHandler<HTMLInputElement> = (e) => {
    // setListVisible(false);
    return props.onBlur?.(e);
  };

  const keydown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === "ArrowUp") {
      if (listVisible) {
        selectNextItem(-1);   
      }
      else {
        setListVisible(true);
      }
      e.preventDefault();
    }
    else if (e.code === "ArrowDown") {
      if (listVisible) {
        selectNextItem(1);
      }
      else {
        setListVisible(true);
      }
      e.preventDefault();
    }
    else if (e.code === "Enter" && listVisible) {
      onSelectItem(matchingSuggestions[selectedIndex]);
      setListVisible(false);
      e.preventDefault();
    }
    else if (e.code === "Escape" && listVisible) {
      setListVisible(false);
      e.preventDefault();
    }
    else {
      const nextIndex = 0;
      if (listRef.current) {
        const items = listRef.current.querySelectorAll("." + styles["list-item"]);
        items[nextIndex].scrollIntoView({
          block: "nearest"
        });
      }
      setSelectedIndex(nextIndex); 
    }

    if (e.code === "Tab") {
      setListVisible(false);
    }

    const openKeys = "abcdefghijklmnopqrstuvwxyzåäö0123456789 §½!\"#¤%&/()=?\`¨'*^-_.:,;<>|@£$€{[]}\\";
    if ((openKeys.includes(e.key) || e.code === "Backspace") && !listVisible) {
      setListVisible(true);
    }

    return props.onKeyDown?.(e);
  };

  const selectNextItem = (direction: number) => {
    const nextIndex = clamp(selectedIndex + direction, 0, matchingSuggestions.length - 1);
    
    if (listRef.current) {
      const items = listRef.current.querySelectorAll("." + styles["list-item"]);
      const nextItem = items[nextIndex];
      
      if (nextItem) {
        nextItem.scrollIntoView({
          block: "nearest"
        });
      }
    }

    setSelectedIndex(nextIndex);
  };

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (containerRef.current.contains(e.target as Node)) {
        return;
      }

      setListVisible(false);
    };

    document.addEventListener("click", click);

    return () => {
      document.removeEventListener("click", click);
      setListVisible(false);
    };
  }, []);

  return (
    <div ref={containerRef} className={[containerClassName, styles["container"]].join(" ")}>
      <input
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        type="text"
        {...inputProps}
        onFocus={focus}
        onBlur={blur}
        onKeyDown={keydown}
        className={styles["field"] + " " + props.className}
      />

      {listVisible && (
        <div ref={listRef} className={styles["list"]} tabIndex={-1}>
          {matchingSuggestions.map((suggestion, index) => (
            <div className={[styles["list-item"], index === selectedIndex ? styles["selected"] : ""].join(" ")} key={suggestion.label} onClick={() => {
              onSelectItem(suggestion);
              setListVisible(false);
            }}>
              {suggestion.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}