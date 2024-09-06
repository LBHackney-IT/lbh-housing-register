import { faker } from '@faker-js/faker';

import { relationshipOptions } from '../components/application/add-person-form';
import { Person } from '../domain/HousingApi';

const dateOfBirth = faker.date.birthdate();
const personRelationshipOptions = relationshipOptions.map(({ value }) => value);

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
