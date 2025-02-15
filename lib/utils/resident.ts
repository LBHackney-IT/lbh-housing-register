import { Applicant } from '../../domain/HousingApi';
import { ApplicationSectionGroup } from '../types/application';
import { getFormIdsFromApplicationSections } from './application-forms';
import { isOver18 } from './dateOfBirth';
import { FormID } from './form-data';

export const applicationSteps = (
  applicant: Applicant,
  isMainApplicant: boolean
): { total: number; remaining: number } => {
  const steps = getFormIdsFromApplicationSections(
    getApplicationSectionsForResident(isMainApplicant, isOver18(applicant))
  );
  let completeSteps = 0;

  steps.forEach((step) =>
    hasResidentAnsweredForm(applicant, step) ? completeSteps++ : null
  );

  return {
    total: steps.length,
    remaining: steps.length - completeSteps,
  };
};

/**
 * Generate a slug from an input
 * @param {string} input The input value we wish to modify
 * @returns {string} The modified value
 */
export const generateSlug = (input: string): string => {
  return encodeURI(input.toLowerCase().replaceAll(' ', '-'));
};

/**
 * Get the application form steps required by this resident
 * @param {Resident} applicant The resident we wish to get the steps for
 * @returns {ApplicationSectionGroup[]} An object of steps, grouped
 */
export const getApplicationSectionsForResident = (
  isMainApplicant: boolean,
  isOver18?: boolean,
  isPartner?: boolean
): ApplicationSectionGroup[] => {
  if (isMainApplicant) {
    return getMainApplicantQuestions();
  } else {
    return getOtherMemberQuestions(isPartner, isOver18);
  }
};

/**
 * Has the user answered any of the questions from the form data / section?
 * @param {Resident} resident The resident
 * @param {string} form ID of the form data / section
 * @returns {boolean}
 */
export const hasResidentAnsweredForm = (
  applicant: Applicant,
  formID: FormID
): boolean => {
  return (
    applicant.questions?.find((q) => q.id?.startsWith(formID)) !== undefined
  );
};

export const getMainApplicantQuestions = (): ApplicationSectionGroup[] => {
  return [
    {
      heading: 'Identity',
      sections: [
        {
          heading: 'Personal details',
          id: FormID.PERSONAL_DETAILS,
        },
        {
          heading: 'Immigration status',
          id: FormID.IMMIGRATION_STATUS,
        },
      ],
    },
    {
      heading: 'Health',
      sections: [
        {
          heading: 'Medical needs',
          id: FormID.MEDICAL_NEEDS,
        },
      ],
    },
    {
      heading: 'Living situation',
      sections: [
        {
          heading: 'Residential status',
          id: FormID.RESIDENTIAL_STATUS,
        },
        {
          heading: 'Address history',
          id: FormID.ADDRESS_HISTORY,
        },
        {
          heading: 'Current accommodation',
          id: FormID.CURRENT_ACCOMMODATION,
        },
        {
          heading: 'Your situation',
          id: FormID.YOUR_SITUATION,
        },
      ],
    },
    {
      heading: 'Money',
      sections: [
        {
          heading: 'Employment',
          id: FormID.EMPLOYMENT,
        },
        {
          heading: 'Income and savings',
          id: FormID.INCOME_SAVINGS,
        },
      ],
    },
  ];
};

const partnerQuestions = [
  {
    heading: 'Identity',
    sections: [
      {
        heading: 'Personal details',
        id: FormID.PERSONAL_DETAILS,
      },
      {
        heading: 'Immigration status',
        id: FormID.IMMIGRATION_STATUS,
      },
    ],
  },
  {
    heading: 'Health',
    sections: [
      {
        heading: 'Medical needs',
        id: FormID.MEDICAL_NEEDS,
      },
    ],
  },
  {
    heading: 'Living situation',
    sections: [
      {
        heading: 'Address history',
        id: FormID.ADDRESS_HISTORY,
      },
    ],
  },
  {
    heading: 'Money',
    sections: [
      {
        heading: 'Employment',
        id: FormID.EMPLOYMENT,
      },
    ],
  },
];

const nonPartnerQuestions = [
  {
    heading: 'Identity',
    sections: [
      {
        heading: 'Personal details',
        id: FormID.PERSONAL_DETAILS,
      },
    ],
  },
  {
    heading: 'Health',
    sections: [
      {
        heading: 'Medical needs',
        id: FormID.MEDICAL_NEEDS,
      },
    ],
  },
  {
    heading: 'Living situation',
    sections: [
      {
        heading: 'Address history',
        id: FormID.ADDRESS_HISTORY,
      },
    ],
  },
  {
    heading: 'Money',
    sections: [
      {
        heading: 'Employment',
        id: FormID.EMPLOYMENT,
      },
    ],
  },
];

const under18Questions = nonPartnerQuestions.filter(
  (category) => category.heading !== 'Money'
);

export const getOtherMemberQuestions = (
  isPartner?: boolean,
  isOver18?: boolean
): ApplicationSectionGroup[] => {
  if (isPartner) {
    return partnerQuestions;
  } else if (isOver18) {
    return nonPartnerQuestions;
  } else {
    return under18Questions;
  }
};
