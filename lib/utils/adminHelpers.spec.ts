import {
  ADDRESS_HISTORY_FIELD,
  validateAddCaseAddressHistory,
  type Address,
} from './adminHelpers';

const sampleAddress: Address = {
  address: {
    line1: '18 Fake Street',
    line2: '',
    town: 'London',
    county: '',
    postcode: 'E154RX',
  },
  date: '2020-01-01T00:00:00.000Z',
  dateTo: '2024-01-01T00:00:00.000Z',
};

describe('validateAddCaseAddressHistory', () => {
  it('returns an address history error when no addresses are provided', () => {
    expect(validateAddCaseAddressHistory([])).toEqual({
      [ADDRESS_HISTORY_FIELD]: 'Address is a required field',
    });
  });

  it('returns no errors when at least one address exists', () => {
    expect(validateAddCaseAddressHistory([sampleAddress])).toEqual({});
  });
});
