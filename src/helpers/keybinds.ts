import type React from "react";
import { titleCase } from "./generic-helper";

export interface Keybind {
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
  },
  "editor-newProof": {
    alt: true,
    key: "KeyN",
  },
  "editor-deleteProof": {
    alt: true,
    key: "Delete",
  }
}

export type KeybindId = keyof typeof KEYBINDS;

export function showKeybindName(keybindName: KeybindId, separator = "+"): string {
  const keybinds = getKeybinds(keybindName);
  if (keybinds.length === 0) {
    return "";
  }

  const first = keybinds[0];
  return showKeybind(first, separator);
}

export function showKeybind(keybind: Keybind, separator = "+"): string {
  const ctrl = keybind.ctrl ?? false;
  const shift = keybind.shift ?? false;
  const alt = keybind.alt ?? false;
  const key = titleCase(keybind.key.toLowerCase().replaceAll("key", ""));

  const parts = [];
  if (ctrl) parts.push("Ctrl");
  if (shift) parts.push("Shift");
  if (alt) parts.push("Alt");
  parts.push(key);

  const str = parts.join(separator);
  return str;
}

export function isKeybindPressed(keybindName: KeybindId, event: KeyboardEvent | React.KeyboardEvent): boolean {
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

function getKeybinds(keybindName: KeybindId): Keybind[] {
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