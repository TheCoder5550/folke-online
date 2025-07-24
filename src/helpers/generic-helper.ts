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

export function cls(...args: (string | boolean)[]) {
  return args.filter(a => typeof a !== "boolean").join(" ");
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