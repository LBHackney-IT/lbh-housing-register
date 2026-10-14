import { isUkPostcode } from './postcode';

describe('isUkPostcode', () => {
  it.each([
    'E9 6PT',
    'e96pt',
    '  e9  6pt  ',
    'E9-6PT',
    '(E9) 6PT',
    'E9.6PT',
    'SW1A 1AA',
    'sw1a1aa',
    'GIR 0AA',
    'A1 1AB',
    'EC1A 1BB',
  ])('accepts %s', (postcode) => {
    expect(isUkPostcode(postcode)).toBe(true);
  });

  it.each(['E8', 'SW1', 'E9 6', 'not a UK postcode', '12345', ''])(
    'rejects %s',
    (postcode) => {
      expect(isUkPostcode(postcode)).toBe(false);
    },
  );
});
