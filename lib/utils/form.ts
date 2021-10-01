import { Applicant, Application } from '../../domain/HousingApi';
import { getQuestionValue } from '../store/applicant';
import { FormData, FormField } from '../types/form';
import { FormID, getEligibilityCriteria } from './form-data';
import { isOver18 } from '../../lib/utils/dateOfBirth';

import { getGenderName } from '../../lib/utils/gender';
import { getAgeInYears } from '../../lib/utils/dateOfBirth';
import { calculateBedrooms } from '../../lib/utils/bedroomCalculator';

/**
 * Determines if the field should be displayed based on the values passed in
 * @param {FormField} field - The field
 * @param {FormData} values - The form values
 * @returns {boolean} - should the field be displayed?
 */
export function getDisplayStateOfField(
  field: FormField,
  values: FormData
): boolean {
  let display = true;

  if (field.conditionalDisplay) {
    field.conditionalDisplay.forEach((condition) => {
      if (display && condition.is) {
        display = values[condition.field] === condition.is;
      }

      if (display && condition.isNot) {
        display = values[condition.field] !== condition.isNot;
      }
    });
  }

  return display;
}

/**
 * Is the form data for the application eligible?
 * @param application The application
 * @returns {[boolean, string[]]} - A tuple of state (isValid) and error message
 */
export function checkEligible(application: Application): [boolean, string[]] {
  let isValid = true;
  let reasons: string[] = [];
  const applicants = [application.mainApplicant, application.otherMembers]
    .filter((v): v is Applicant | Applicant[] => v !== undefined)
    .flat();
  const mainApplicant = applicants[0];
  const bedroomArray = applicants.map((applicant) => ({
    age: getAgeInYears(applicant),
    gender: getGenderName(applicant),
  }));

  const hasPartnerSharing = !!applicants.find(
    (applicant) => applicant.person?.relationshipType === 'partner'
  );

  const bedroomNeed = calculateBedrooms(bedroomArray, hasPartnerSharing);

  const setInvalid = (reasoning?: string): void => {
    isValid = false;

    if (reasoning) {
      reasons.push(reasoning);
    }
  };

  const requestedNumberOfBedrooms = getQuestionValue(
    mainApplicant.questions,
    FormID.CURRENT_ACCOMMODATION,
    'home-how-many-bedrooms'
  );

  if (bedroomNeed <= requestedNumberOfBedrooms) {
    setInvalid(
      'Based on our calculations, you are not lacking two or more rooms'
    );
  }
  //******** *//

  if (!isOver18(mainApplicant)) {
    setInvalid('You are under 18 years old');
  }

  for (const [form, values] of Object.entries(FormID)) {
    const eligibilityCriteria = getEligibilityCriteria(values);
    eligibilityCriteria?.forEach((criteria) => {
      const fieldValue = getQuestionValue(
        mainApplicant.questions,
        values,
        criteria.field
      );

      if (Array.isArray(fieldValue) && fieldValue.indexOf(criteria.is) !== -1) {
        setInvalid(criteria.reasoning);
      }

      if (criteria.is && criteria.is === fieldValue) {
        setInvalid(criteria.reasoning);
      }

      if (criteria.isNot && criteria.isNot === fieldValue) {
        setInvalid(criteria.reasoning);
      }
    });
  }

  return [isValid, reasons];
}

export function formatDate(date: Date) {
  return `${date.toLocaleString('default', {
    month: 'long',
  })} ${date.getFullYear()}`;
}
