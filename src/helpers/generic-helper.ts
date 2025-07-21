export function getUUID() {
  return (Math.random() + 1).toString(36).substring(7);
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