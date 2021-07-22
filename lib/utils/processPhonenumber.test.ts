import processPhonenumber from './processPhonenumber';

test('process phone number', () => {
  expect(processPhonenumber('+447700000000')).toBe('+447700000000');
  expect(processPhonenumber('+17700000000')).toBe('+17700000000');
  expect(processPhonenumber('07700000000')).toBe('+447700000000');
  expect(processPhonenumber('17700000000')).toBe('+4417700000000');
  expect(processPhonenumber('07700 000 000')).toBe('+447700000000');
  expect(processPhonenumber('(07700) 000 000')).toBe('+447700000000');
});
