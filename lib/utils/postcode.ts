/**
 * Loose UK postcode check.
 * Case, spaces and punctuation are ignored. What remains must be a full
 * outward code plus inward code (for example E96PT or SW1A1AA).
 */
const UK_POSTCODE = /^(?:GIR0AA|[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2})$/;

export const UK_POSTCODE_ERROR = 'Enter a full UK postcode';

export const isUkPostcode = (value: string): boolean => {
  const normalised = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return UK_POSTCODE.test(normalised);
};
