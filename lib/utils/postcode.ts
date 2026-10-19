/**
 * Loose UK postcode check.
 * Case, spaces and punctuation are ignored. What remains must be a full
 * outward code plus inward code (for example E96PT or SW1A1AA).
 */
const UK_POSTCODE = /^(?:GIR0AA|[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2})$/;

export const UK_POSTCODE_ERROR = 'Enter a valid UK postcode';

const normalisePostcode = (value: string): string =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, '');

export const isUkPostcode = (value: string): boolean =>
  UK_POSTCODE.test(normalisePostcode(value));

export const formatPostcode = (value: string): string => {
  const normalised = normalisePostcode(value);
  if (!UK_POSTCODE.test(normalised)) {
    return value.toUpperCase();
  }
  return `${normalised.slice(0, -3)} ${normalised.slice(-3)}`;
};
