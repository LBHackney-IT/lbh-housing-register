import { faker } from '@faker-js/faker';
import { faker as fakerEnGB } from '@faker-js/faker/locale/en_GB';

import { Application } from 'domain/HousingApi';

import { type Address } from '../lib/utils/adminHelpers';
import { generatePerson } from './personHelper';

export const generateApplication = (
  applicationId: string,
  personId: string,
  addMainApplicant: boolean = true,
  addOtherMembers: boolean = true,
  addAssessment?: boolean,
  submittedAt?: string,
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

export const completedApplicationFormSections = [
  {
    answer: 'true',
    id: 'personal-details/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'immigration-status/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'medical-needs/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'residential-status/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'address-history/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'current-accommodation/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'current-accommodation-landlord-details/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'situation-armed-forces/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'homelessness/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'property-ownership/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'sold-property/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'arrears/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'breach-of-tenancy/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'legal-restrictions/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'unspent-convictions/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'your-situation/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'employment/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'income-savings/sectionCompleted',
  },
];

export const generateSampleMainApplicantAddressHistory = (): Address[] => {
  const dateFrom = faker.date.past({ years: 10 });
  const dateTo = faker.date.between({ from: dateFrom, to: new Date() });

  return [
    {
      address: {
        line1: fakerEnGB.location.streetAddress(),
        line2: fakerEnGB.location.secondaryAddress(),
        town: fakerEnGB.location.city(),
        county: fakerEnGB.location.county(),
        postcode: fakerEnGB.location.zipCode(),
      },
      date: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
    },
  ];
};

export const withMainApplicantAddressHistory = (
  application: Application,
): Application => {
  if (!application.mainApplicant) {
    return application;
  }

  return {
    ...application,
    mainApplicant: {
      ...application.mainApplicant,
      questions: [
        ...(application.mainApplicant.questions ?? []),
        {
          id: 'address-history/addressHistory',
          answer: JSON.stringify(generateSampleMainApplicantAddressHistory()),
        },
      ],
    },
  };
};
