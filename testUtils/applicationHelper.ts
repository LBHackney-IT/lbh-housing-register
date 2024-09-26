import { faker } from '@faker-js/faker';

import { Application } from 'domain/HousingApi';

import { generatePerson } from './personHelper';

export const generateApplication = (
  applicationId: string,
  personId: string,
  addMainApplicant: boolean = true,
  addOtherMembers: boolean = true,
  addAssessment?: boolean,
  submittedAt?: string
): Application => {
  return {
    id: applicationId,
    reference: faker.string.alphanumeric(10),
    status: 'New',
    sensitiveData: false,
    assignedTo: 'unassigned',
    createdAt: faker.date.recent().toISOString(),
    submittedAt,
    mainApplicant: {
      person: addMainApplicant ? generatePerson(personId) : undefined,
      address: undefined,
      contactInformation: {
        emailAddress: faker.internet.email({ provider: 'hackneyTEST.gov.uk' }),
        phoneNumber: undefined,
        preferredMethodOfContact: undefined,
      },
      questions: undefined,
      requiresMedical: false,
      medicalNeed: undefined,
    },
    calculatedBedroomNeed: undefined,
    otherMembers: addOtherMembers
      ? [
          {
            person: generatePerson(personId + 1),
            contactInformation: {
              emailAddress: faker.internet.email({
                provider: 'hackneyTEST.gov.uk',
              }),
            },
          },
        ]
      : [],
    assessment: addAssessment
      ? {
          effectiveDate: faker.date.recent().toISOString(),
        }
      : undefined,
    importedFromLegacyDatabase: false,
  };
};
