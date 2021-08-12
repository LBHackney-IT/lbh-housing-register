import { calculateBedrooms } from './bedroomCalculator';

describe('BedroomCalculator', () => {
  it('should award 1 bedroom for different genders under the age of 10', () => {
    let people = [
      { age: 5, gender: 'male' },
      { age: 5, gender: 'female' },
    ];
    expect(calculateBedrooms(people)).toBe(1);
  });

  it('[[5, `male`], [5, `female`]] should be awarded 2 bedrooms', () => {
    let people = [
      [5, 'male', 'son'],
      [10, 'female', 'daughter'],
    ];
    expect(calculateBedrooms(people)).toBe(2);
  });

  it('[[5, `male`], [15, `male`], [10, `female`]] should be awarded 2 bedrooms', () => {
    let people = [
      [5, 'male', 'son'],
      [15, 'male', 'son'],
      [10, 'female', 'daughter'],
    ];
    expect(calculateBedrooms(people)).toBe(2);
  });

  it('[[5, `male`], [5, `female`], [5, `female`], [12, `female`]] should be awarded 2 bedrooms', () => {
    let people = [
      [5, 'male', 'son'],
      [15, 'male', 'son'],
      [10, 'female', 'daughter'],
      [12, 'female', 'daughter'],
    ];
    expect(calculateBedrooms(people)).toBe(2);
  });

  it('should calculate correct amount of bedrooms for couple without children', () => {
    let people = [
      [30, 'male', null],
      [25, 'female', 'partner'],
    ];
    expect(calculateBedrooms(people)).toBe(1);
  });

  it('should calculate correct amount of bedrooms for couples with children', () => {
    let people = [
      [30, 'male', null],
      [25, 'female', 'partner'],
      [5, 'male', 'son'],
      [7, 'female', 'daugther'],
    ];
    expect(calculateBedrooms(people)).toBe(2);
  });
});
