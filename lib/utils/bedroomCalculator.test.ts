import { calculateBedrooms } from './bedroomCalculator';

describe('BedroomCalculator', () => {
  it('should award 1 bedroom for different genders under the age of 10', () => {
    let people = [
      [5, 'male', 'son'],
      [5, 'female', 'daughter'],
    ];
    expect(calculateBedrooms(people)).toBe(1);
  });

  it('Children of different genders where one is over 10 should be awarded 2 bedrooms', () => {
    let people = [
      [5, 'male', 'son'],
      [10, 'female', 'daughter'],
    ];
    expect(calculateBedrooms(people)).toBe(2);
  });

  it('Children of ages between 5 to 15 of different genders should be awarded 2 bedrooms', () => {
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

  it('should calculate 2 bedrooms for couple with children under the age of 10(different gender)', () => {
    let people = [
      [30, 'male', null],
      [25, 'female', 'partner'],
      [5, 'male', 'son'],
      [7, 'female', 'daugther'],
    ];
    expect(calculateBedrooms(people)).toBe(2);
  });

  it('should calculate 3 bedrooms for couple with children over the age of 10(different gender)', () => {
    let people = [
      [30, 'male', null],
      [25, 'female', 'partner'],
      [11, 'male', 'son'],
      [12, 'female', 'daugther'],
    ];
    expect(calculateBedrooms(people)).toBe(3);
  });
});
