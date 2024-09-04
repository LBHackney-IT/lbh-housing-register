import { faker } from '@faker-js/faker';

import { relationshipOptions } from '../components/application/add-person-form';
import { Person } from '../domain/HousingApi';

const firstName = faker.person.firstName();
const lastName = faker.person.lastName();
const middleName = faker.person.middleName();
const dateOfBirth = faker.date.birthdate();
const personRelationshipOption = relationshipOptions.map(({ value }) => value);

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
    firstName,
    middleName,
    surname: lastName,
    dateOfBirth: dateOfBirth.toDateString(),
    gender: faker.helpers.arrayElement(['M', 'F', 'self']),
    genderDescription: faker.lorem.lines(1),
    relationshipType: faker.helpers.arrayElement(personRelationshipOption),
    nationalInsuranceNumber: faker.string.alphanumeric(9),
    age: calculateAge(dateOfBirth),
  };
};
