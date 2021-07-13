import { Applicant } from '../../domain/HousingApi';
import { ApplicationSteps } from '../types/application';
import { getFormIdsFromApplicationSteps } from './application-forms';
import {
  ADDRESS_DETAILS, ADDRESS_HISTORY, IMMIGRATION_STATUS,
  PERSONAL_DETAILS, RESIDENTIAL_STATUS, YOUR_SITUATION
} from './form-data';

export const applicationStepsRemaining = (
  applicant: Applicant,
  isMainApplicant: boolean
): number => {
  const steps = getFormIdsFromApplicationSteps(
    getApplicationStepsForResident(isMainApplicant)
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
 * @returns {ApplicationSteps[]} An object of steps, grouped
 */
export const getApplicationStepsForResident = (
  isMainApplicant: boolean
): ApplicationSteps[] => {
  if (isMainApplicant) {
    return [
      {
        heading: 'Identity',
        steps: [
          {
            heading: 'Your situation',
            id: YOUR_SITUATION,
          },
          {
            heading: 'Immigration status',
            id: IMMIGRATION_STATUS,
          },
          {
            heading: 'Personal details',
            id: PERSONAL_DETAILS,
          },
        ],
      },
      {
        heading: 'Accommodation',
        steps: [
          {
            heading: 'Residential Status',
            id: RESIDENTIAL_STATUS,
          },
          {
            heading: 'Address history',
            id: ADDRESS_HISTORY,
          },
          {
            heading: 'Current accommodation',
            id: ADDRESS_DETAILS,
          },
        ],
      },
    ];
  } else {
    return [
      {
        heading: 'Identity',
        steps: [
          {
            heading: 'Immigration status',
            id: IMMIGRATION_STATUS,
          },
          {
            heading: 'Personal details',
            id: PERSONAL_DETAILS,
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
  form: string
): boolean => {
  // TODO how are we going to structure this nested array of questions. And how are we going to record that a section has been answered?
  // Will we store each section as a JSON encoded string? We'll use a dot notation. E.g. residential-status.moved-borough.
  // You've answered the form if you've answered at least one question within it.

  return applicant.questions?.find((q) => q.id?.startsWith(form)) !== undefined;
};
