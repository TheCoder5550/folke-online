import { v4 as uuidv4 } from 'uuid';

export function getUUID() {
  return uuidv4();
}

export function sum(list: number[]): number {
  return list.reduce((a, b) => a + b, 0);
}

export function clamp(t: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, t));
}

export function mod(x: number, max: number) {
  return ((x % max) + max) % max;
}

export function insertAtIndex<T>(arr: T[], index: number, item: T): T[] {
  arr.splice(index, 0, item);
  return arr;
}

export function logProxy(proxy: object) {
  console.log(JSON.parse(JSON.stringify(proxy)));
}

export function trimPrefix(str: string, prefix: string) {
  prefix = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  return str.replace(new RegExp(
    "^(" + prefix + ")", "g"
  ), "");
}

export function cls(...args: (string | boolean | undefined)[]) {
  return args.filter(a => typeof a === "string").join(" ");
}

export function findParentElement(element: HTMLElement, func: (element: HTMLElement) => boolean) {
  let currentElement: HTMLElement | null = element;
  while (currentElement) {
    if (func(currentElement)) {
      return currentElement;
    }

    currentElement = currentElement.parentElement;
  }

  return null;
}

export function downloadText(text: string, filename = "text.txt") {
  const blob = new Blob([text], {
    type: "text/plain;charset=utf-8;",
  });

  const elem = window.document.createElement("a");
  elem.href = window.URL.createObjectURL(blob);
  elem.download = filename;
  elem.click();
}

export function titleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
}

/**
 * Blur active element
 */
export function blur() {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

/**
 * Map function for objects instead of arrays
 */
export function mapObject<T>(obj: { [id: string]: T }, func: (value: T, key: string, index: number) => T): { [id: string]: T } {
  return Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, func(v, k, i)]
    )
  )
}