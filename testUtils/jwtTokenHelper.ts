import { faker } from '@faker-js/faker';

import { HackneyGoogleUser } from '../domain/HackneyGoogleUser';

const issuedAtInMilliseconds = new Date().getMilliseconds();

export const generateJWTTokenTestData = (
  groups: string[] = [],
  issuedAt: number = issuedAtInMilliseconds
): HackneyGoogleUser => {
  return {
    sub: faker.number.int().toString(),
    email: faker.internet.email(),
    iss: 'TestIssuer',
    name: faker.person.fullName(),
    groups,
    iat: issuedAt,
  };
};
