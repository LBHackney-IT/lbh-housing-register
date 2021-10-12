export default function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function kebabToCamelCase(string: string) {
  return string.replace(/-./g, (letter) => letter.toUpperCase()[1]);
}

export function camelCaseToKebab(string: string) {
  return string.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase()
  );
}
