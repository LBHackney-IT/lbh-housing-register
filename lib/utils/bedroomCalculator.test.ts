import { calculateBedrooms } from './bedroomCalculator';

describe('BedroomCalculator', () => {
  it('should award 1 bedroom for different genders under the age of 10', () => {
    let people = [
      { age: 5, gender: 'male' },
      { age: 5, gender: 'female' },
    ];
    expect(calculateBedrooms(people, false)).toBe(1);
  });

  it('Children of different genders where one is over 10 should be awarded 2 bedrooms', () => {
    let people = [
      { age: 5, gender: 'male' },
      { age: 10, gender: 'female' },
    ];
    expect(calculateBedrooms(people, false)).toBe(2);
  });

  it('Children of ages between 5 to 15 of different genders should be awarded 2 bedrooms', () => {
    let people = [
      { age: 5, gender: 'male' },
      { age: 15, gender: 'male' },
      { age: 10, gender: 'female' },
    ];
    expect(calculateBedrooms(people, false)).toBe(2);
  });

  it('2 boys aged between 5 and 15 and 2 girls aged 10 and 12 should be awarded 2 bedrooms', () => {
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

  it('should calculate 2 bedrooms for couple with children under the age of 10(different gender)', () => {
    let people = [
      { age: 30, gender: 'male' },
      { age: 25, gender: 'female' },
      { age: 5, gender: 'male' },
      { age: 7, gender: 'female' },
    ];
    expect(calculateBedrooms(people, true)).toBe(2);
  });

  it('should calculate 3 bedrooms for couple with children over the age of 10(different gender)', () => {
    let people = [
      { age: 30, gender: 'male' },
      { age: 25, gender: 'female' },
      { age: 11, gender: 'male' },
      { age: 12, gender: 'female' },
    ];
    expect(calculateBedrooms(people, true)).toBe(3);
  });
});
