export {};
declare global {
  interface String {
    Capitalize(): string;
  }
}

String.prototype.Capitalize = function (): string {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
