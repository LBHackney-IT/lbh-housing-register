export default function processPhonenumber(input: string): string {
  const chars = input.match(/[\+0-9]/g);

  if (!chars) {
    return '';
  }
  if (chars[0] === '0') {
    return ['+44', ...chars.slice(1)].join('');
  }
  if (chars[0] !== '+') {
    return ['+44', ...chars].join('');
  }
  return chars.join('');
}
