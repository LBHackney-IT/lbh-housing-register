import { Applicant } from '../../domain/HousingApi';
import { ApplicationSectionGroup } from '../types/application';
import { getFormIdsFromApplicationSections } from './application-forms';
import { FormID } from './form-data';

export const applicationStepsRemaining = (
  applicant: Applicant,
  isMainApplicant: boolean
): number => {
  const steps = getFormIdsFromApplicationSections(
    getApplicationSectionsForResident(isMainApplicant)
  );
  let completeSteps = 0;

  steps.map((step) =>
    hasResidentAnsweredForm(applicant, step) ? completeSteps++ : null
  );

  return steps.length - completeSteps;
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
  isMainApplicant: boolean
): ApplicationSectionGroup[] => {
  if (isMainApplicant) {
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
          {
            heading: 'Employment',
            id: FormID.EMPLOYMENT,
          },
        ],
      },
      {
        heading: 'Living Situation',
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
            heading: 'Income and savings',
            id: FormID.INCOME_SAVINGS,
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
    ];
  } else {
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
    ];
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
