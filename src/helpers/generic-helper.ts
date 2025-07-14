export function sum(list: number[]): number {
  return list.reduce((a, b) => a + b, 0);
}