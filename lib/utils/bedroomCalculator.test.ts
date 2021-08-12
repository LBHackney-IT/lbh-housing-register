import { calculateBedrooms } from './bedroomCalculator';

describe('BedroomCalculator', () => {
  it('should award 1 bedroom for different genders under the age of 10', () => {
    let people = [
      { age: 5, gender: 'male' },
      { age: 5, gender: 'female' },
    ];
    expect(calculateBedrooms(people, false)).toBe(1);
  });

  it('[[5, `male`], [5, `female`]] should be awarded 2 bedrooms', () => {
    let people = [
      { age: 5, gender: 'male' },
      { age: 10, gender: 'female' },
    ];
    expect(calculateBedrooms(people, false)).toBe(2);
  });

  it('[[5, `male`], [15, `male`], [10, `female`]] should be awarded 2 bedrooms', () => {
    let people = [
      { age: 5, gender: 'male' },
      { age: 15, gender: 'male' },
      { age: 10, gender: 'female' },
    ];
    expect(calculateBedrooms(people, false)).toBe(2);
  });

  it('[[5, `male`], [5, `female`], [5, `female`], [12, `female`]] should be awarded 2 bedrooms', () => {
    let people = [
      { age: 5, gender: 'male' },
      { age: 15, gender: 'male' },
      { age: 10, gender: 'female' },
      { age: 12, gender: 'female' },
    ];
    expect(calculateBedrooms(people, false)).toBe(2);
  });

  it('should calculate correct amount of bedrooms for couple without children', () => {
    let people = [
      { age: 30, gender: 'male' },
      { age: 25, gender: 'female' },
    ];
    expect(calculateBedrooms(people, true)).toBe(1);
  });

  it('should calculate correct amount of bedrooms for couples with children', () => {
    let people = [
      { age: 30, gender: 'male' },
      { age: 25, gender: 'female' },
      { age: 5, gender: 'male' },
      { age: 7, gender: 'female' },
    ];
    expect(calculateBedrooms(people, true)).toBe(2);
  });
});
