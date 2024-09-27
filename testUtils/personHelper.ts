import { faker } from '@faker-js/faker';

import { relationshipOptions } from '../components/application/add-person-form';
import { Person } from '../domain/HousingApi';

const dateOfBirth = faker.date.birthdate();
const personRelationshipOptions = relationshipOptions.map(({ value }) => value);

//matches the values in data/sign-up-details.json
export enum TitleEnum {
  Mrs = 'Mrs',
  Mr = 'Mr',
  Miss = 'Miss',
  Mx = 'Mx',
  Other = 'Other',
  Ms = 'Ms',
}

//Logic from the HR API
export const calculateAge = (birthDate: Date): number => {
  const now = new Date();
  let age = now.getUTCFullYear() - birthDate.getUTCFullYear();

  if (
    now.getUTCMonth() < birthDate.getUTCMonth() ||
    (now.getUTCMonth() === birthDate.getUTCMonth() &&
      now.getUTCDate() < birthDate.getUTCDate())
  ) {
    age--;
  }

  return age;
};

export const generatePerson = (personId: string): Person => {
  return {
    id: personId,
    title: faker.helpers.enumValue(Person.TitleEnum),
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    surname: faker.person.lastName(),
    dateOfBirth: dateOfBirth.toDateString(),
    gender: faker.helpers.arrayElement(['M', 'F', 'self']),
    genderDescription: faker.lorem.lines(1),
    relationshipType: faker.helpers.arrayElement(personRelationshipOptions),
    nationalInsuranceNumber: faker.string.alphanumeric(9),
    age: calculateAge(dateOfBirth),
  };
};

export const getRandomGender = (): string => {
  //values match the current form
  const genderOptions = ['M', 'F', 'self'];
  return genderOptions[Math.floor(Math.random() * genderOptions.length)];
};
