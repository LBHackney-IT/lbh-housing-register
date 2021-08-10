import { CALCULATE_BEDROOMS } from './bedroomCalculator';

const people = [
  [
    [5, 'male', 'son'],
    [5, 'female', 'daughter'],
  ],
  [
    [5, 'male', 'son'],
    [10, 'female', 'daughter'],
  ],
  [
    [5, 'male', 'son'],
    [15, 'male', 'son'],
    [10, 'female', 'daughter'],
  ],
  [
    [5, 'male', 'son'],
    [15, 'male', 'son'],
    [10, 'female', 'daughter'],
    [12, 'female', 'daughter'],
  ],
  [
    [5, 'male', 'son'],
    [5, 'female', 'daughter'],
    [5, 'female', 'daughter'],
    [12, 'female', 'daughter'],
  ],
  [
    [30, 'male', null],
    [25, 'female', 'partner'],
  ],
];

describe.only('BedroomCalculator', () => {
  test('[[5, `male`], [5, `male`]] should be awarded 1 bedroom', () => {
    expect(CALCULATE_BEDROOMS(people[0])).toBe(1);
  });
  test('[[5, `male`], [5, `female`]] should be awarded 2 bedrooms', () => {
    expect(CALCULATE_BEDROOMS(people[1])).toBe(2);
  });
  test('[[5, `male`], [15, `male`], [10, `female`]] should be awarded 2 bedrooms', () => {
    expect(CALCULATE_BEDROOMS(people[2])).toBe(2);
  });
  test('[[5, `male`], [5, `female`], [5, `female`], [12, `female`]] should be awarded 2 bedrooms', () => {
    expect(CALCULATE_BEDROOMS(people[3])).toBe(2);
  });
  test('Couple should be awarded only 1 bedroom ', () => {
    expect(CALCULATE_BEDROOMS(people[5])).toBe(1);
  });
});
