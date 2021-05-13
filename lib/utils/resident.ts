export const generateSlug = (input: string) => {
  return encodeURI(input.toLowerCase().replaceAll(' ', '-'))
}