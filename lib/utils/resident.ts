import { getFormIdsFromApplicationSteps } from './application-forms';
import { Store as ReduxStore } from '../store';
import { updateResident } from '../store/additionalResidents';
import { MAIN_RESIDENT_KEY, updateFormData } from '../store/resident';
import { ApplicationSteps } from '../types/application';
import { FormData } from '../types/form';
import { Resident } from '../types/resident';
import { Store } from 'redux';
import {
  ADDRESS_DETAILS,
  IMMIGRATION_STATUS,
  PERSONAL_DETAILS,
  YOUR_SITUATION,
  RESIDENTIAL_STATUS,
  ADDRESS_HISTORY,
} from './form-data';
import { checkEligible } from './form';

export const applicationStepsRemaining = (resident: Resident): number => {
  const steps = getFormIdsFromApplicationSteps(
    getApplicationStepsForResident(resident)
  );
  let completeSteps = 0;

  steps.map((step) =>
    hasResidentAnsweredForm(resident, step) ? completeSteps++ : null
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
 * Get the resident
 * @param {string} slug The ID/slug of the resident
 * @param {Store} store The redux store
 * @returns {Resident | undefined} The resident (if found)
 */
export const getResident = (
  slug: string,
  store: ReduxStore
): Resident | undefined => {
  if (slug == MAIN_RESIDENT_KEY) {
    return store.resident;
  } else {
    const matches = store.additionalResidents.filter(
      (resident) => resident.slug == slug
    );
    if (matches.length > 0) {
      return matches[0];
    }
  }
};

/**
 * Get the application form steps required by this resident
 * @param {Resident} resident The resident we wish to get the steps for
 * @returns {ApplicationSteps[]} An object of steps, grouped
 */
export const getApplicationStepsForResident = (
  resident: Resident
): ApplicationSteps[] => {
  if (isMainResident(resident)) {
    return [
      // {
      //   heading: "Testing",
      //   steps: [
      //     {
      //       heading: "Test form",
      //       id: "test-form"
      //     }
      //   ]
      // },
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
            id: ADDRESS_HISTORY
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
  resident: Resident,
  form: string
): boolean => {
  return resident.formData[form] != undefined;
};

/**
 * Check to see if the resident is the main applicant
 * @param {Resident} resident The resident we are interrogating
 * @returns {boolean}
 */
export const isMainResident = (resident: Resident): boolean => {
  return resident.slug == MAIN_RESIDENT_KEY;
};

/**
 * Update the form data for the given resident
 * @param {Store} store The redux store
 * @param {Resident} resident The resident we wish to update
 * @param {FormData} data The data we are updating
 */
export const updateResidentsFormData = (
  store: Store,
  resident: Resident,
  data: FormData
): void => {
  if (isMainResident(resident)) {
    store.dispatch(updateFormData(data));
  } else {
    resident = { ...resident };
    resident.formData = { ...resident.formData, ...data };

    const eligibility = checkEligible(resident.formData);
    resident.isEligible = eligibility[0];
    resident.ineligibilityReasons = eligibility[1];

    store.dispatch(updateResident(resident));
  }
};
