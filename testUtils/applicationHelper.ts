import { faker } from '@faker-js/faker';

import { Application } from 'domain/HousingApi';

import { generatePerson } from './personHelper';

export const generateApplication = (
  applicationId: string,
  personId: string
): Application => {
  return {
    id: applicationId,
    reference: faker.string.alphanumeric(10),
    status: 'New',
    sensitiveData: false,
    assignedTo: 'unassigned',
    createdAt: faker.date.recent().toISOString(),
    submittedAt: faker.date.recent().toString(),
    mainApplicant: {
      person: generatePerson(personId),
      contactInformation: {
        emailAddress: faker.internet.email({ provider: 'hackneyTEST.gov.uk' }),
      },
    },
    otherMembers: [
      {
        person: generatePerson(personId + 1),
        contactInformation: {
          emailAddress: faker.internet.email({
            provider: 'hackneyTEST.gov.uk',
          }),
        },
      },
    ],
    assessment: {
      effectiveDate: faker.date.recent().toISOString(),
    },
    importedFromLegacyDatabase: false,
  };
};
