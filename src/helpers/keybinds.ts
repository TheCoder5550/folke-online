import type React from "react";
import { titleCase } from "./generic-helper";

interface Keybind {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  key: string;
}

export const KEYBINDS = {
  "undo": {
    ctrl: true,
    key: "KeyZ"
  },
  "redo": [
    {
      ctrl: true,
      shift: true,
      key: "KeyZ"
    },
    {
      ctrl: true,
      key: "KeyY"
    }
  ],
  "proof-toBox": {
    ctrl: true,
    key: "KeyB",
  },
  "proof-toLine": {
    alt: true,
    key: "KeyB",
  },
  "proof-closeBox": {
    ctrl: true,
    key: "Enter",
  },
  "proof-remove": {
    key: "Delete",
  },
  "proof-removeIfEmpty": {
    key: "Backspace",
  },
  "proof-insertAfter": {
    key: "Enter",
  },
  "proof-insertBefore": {
    ctrl: true,
    shift: true,
    key: "Enter",
  },
  "proof-nextField": {
    key: "Enter",
  }
}

export function showKeybind(keybindName: keyof typeof KEYBINDS, separator = "+"): string {
  const keybinds = getKeybinds(keybindName);
  if (keybinds.length === 0) {
    return "";
  }

  const first = keybinds[0];
  const ctrl = first.ctrl ?? false;
  const shift = first.shift ?? false;
  const alt = first.alt ?? false;
  const key = titleCase(first.key.toLowerCase().replaceAll("key", ""));

  const parts = [];
  if (ctrl) parts.push("Ctrl");
  if (shift) parts.push("Shift");
  if (alt) parts.push("Alt");
  parts.push(key);

  const str = parts.join(separator);
  return str;
}

export function isKeybindPressed(keybindName: keyof typeof KEYBINDS, event: KeyboardEvent | React.KeyboardEvent): boolean {
  if (!(keybindName in KEYBINDS)) {
    throw new Error("Invalid keybind: " + keybindName);
  }

  const matchingKeybind = KEYBINDS[keybindName];
  const allBinds = Array.isArray(matchingKeybind) ? matchingKeybind : [ matchingKeybind ];

  for (const bind of allBinds) {
    const match = matchKeybind(bind, event);
    if (match) {
      return true;
    }
  }

  return false;
}

function getKeybinds(keybindName: keyof typeof KEYBINDS): Keybind[] {
  if (!(keybindName in KEYBINDS)) {
    throw new Error("Invalid keybind: " + keybindName);
  }

  const matchingKeybind = KEYBINDS[keybindName];
  const allBinds = Array.isArray(matchingKeybind) ? matchingKeybind : [ matchingKeybind ];
  return allBinds;
}

function matchKeybind(bind: Keybind, event: KeyboardEvent | React.KeyboardEvent): boolean {
  const ctrl = bind.ctrl ?? false;
  const shift = bind.shift ?? false;
  const alt = bind.alt ?? false;

  return (
    ctrl === event.ctrlKey &&
    shift === event.shiftKey &&
    alt === event.altKey &&
    (
      bind.key === event.code ||
      bind.key === event.which.toString() ||
      bind.key === event.key
    )
  )
}