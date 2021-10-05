import MockDate from 'mockdate';
import {
  calculateDurations,
  checkAddressHistory,
  formatDate,
} from './addressHistory';
MockDate.set('2020-06-01');

const partialEntry = {
  address: {},
  date: '',
  postcode: '',
};

describe('checkAddressHistory', () => {
  test('checkAddressHistory calculates correctly ', () => {
    expect(
      checkAddressHistory(
        [
          {
            ...partialEntry,
            date: '2019-06-01',
            dateTo: '',
          },
        ],
        1
      )
    ).toBe(true);
    expect(
      checkAddressHistory(
        [
          {
            ...partialEntry,
            date: '2020-01-01',
            dateTo: '',
          },
          {
            ...partialEntry,
            date: '2019-06-01',
            dateTo: '2020-01-01',
          },
        ],
        1
      )
    ).toBe(true);
  });
  test('checkAddressHistory only checks the last date', () => {
    expect(
      checkAddressHistory(
        [
          {
            ...partialEntry,
            date: '2019-06-01',
            dateTo: '2020-01-01',
          },
          {
            ...partialEntry,
            date: '2020-01-01',
            dateTo: '',
          },
        ],
        1
      )
    ).toBe(false);
  });
});

test('formatDate', () => {
  expect(formatDate(new Date())).toBe('June 2020');
});

test('calculateDurations calculates accurately', () => {
  expect(
    calculateDurations([
      {
        ...partialEntry,
        date: '2020-01-01',
        dateTo: '',
      },
      {
        ...partialEntry,
        date: '2019-06-01',
        dateTo: '2020-01-01',
      },
    ])
  ).toMatchSnapshot();
});
