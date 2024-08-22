export interface Difference {
  type: string;
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lhs: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rhs: any;
}

declare module 'nested-object-diff' {
  export function diff(a: unknown, b: unknown): Difference[];
}
