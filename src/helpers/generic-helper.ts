export function sum(list: number[]): number {
  return list.reduce((a, b) => a + b, 0);
}

export function clamp(t: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, t));
}