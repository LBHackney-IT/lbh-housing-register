export default function assertNever(never: never, error: string): never {
  throw new Error(error);
}
