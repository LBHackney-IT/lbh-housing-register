/**
 * Formik field errors can be a string, array of strings, or nested object.
 * Normalise to a single line for GOV.UK error summary links.
 */
export function formatFormikFieldError(
  error: string | string[] | object | undefined,
): string {
  if (typeof error === 'string') return error;
  if (Array.isArray(error)) return error.join(', ');
  return 'Error';
}
