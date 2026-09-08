import { faker } from '@faker-js/faker';

import { StaffUser } from '../domain/StaffUser';

const issuedAtInMilliseconds = new Date().getMilliseconds();

export const generateJWTTokenTestData = (
  groups: string[] = [],
  issuedAt: number = issuedAtInMilliseconds,
): StaffUser => {
  return {
    sub: faker.number.int().toString(),
    email: faker.internet.email(),
    iss: 'TestIssuer',
    name: faker.person.fullName(),
    groups,
    iat: issuedAt,
  };
};
