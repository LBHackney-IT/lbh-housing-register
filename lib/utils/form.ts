import { Applicant, Application } from '../../domain/HousingApi';
import { getQuestionValue } from '../store/applicant';
import { FormData, FormField } from '../types/form';
import { isOver18, isOver55 } from './dateOfBirth';
import { DisqualificationReason } from './disqualificationReasonOptions';
import { FormID, getEligibilityCriteria } from './form-data';
import { applicantsWithMedicalNeed } from './medicalNeed';

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

export function checkEligible(
  application: Application
): [boolean, DisqualificationReason[]] {
  let isValid = true;
  const reasons: DisqualificationReason[] = [];
  const applicants = [application.mainApplicant, application.otherMembers]
    .filter((v): v is Applicant | Applicant[] => v !== undefined)
    .flat();
  const mainApplicant = applicants[0];

  const bedroomNeed = application.calculatedBedroomNeed!;

  // Do not disqualify if...

  // ...applying alone and over 55
  if (applicants.length === 1 && isOver55(mainApplicant)) {
    return [true, []];
  }

  // ...applying with partner and both over 55
  if (applicants.length === 2) {
    if (
      isOver55(mainApplicant) &&
      isOver55(applicants[1]) &&
      applicants[1].person?.relationshipType === 'partner'
    ) {
      return [true, []];
    }
  }

  // ...one or more applicants have a medical need
  if (applicantsWithMedicalNeed(application) > 0) {
    return [true, []];
  }

  const setInvalid = (reasoning: DisqualificationReason) => {
    isValid = false;
    reasons.push(reasoning);
  };

  const requestedNumberOfBedrooms = getQuestionValue(
    mainApplicant.questions,
    FormID.CURRENT_ACCOMMODATION,
    'home-how-many-bedrooms'
  );

  if (bedroomNeed <= requestedNumberOfBedrooms) {
    setInvalid('notLackingRooms');
  }

  if (!isOver18(mainApplicant)) {
    setInvalid('under18YearsOld');
  }

  for (const formID of Object.values(FormID)) {
    const eligibilityCriteria = getEligibilityCriteria(formID);
    eligibilityCriteria?.forEach((criteria) => {
      const fieldValue = getQuestionValue(
        mainApplicant.questions,
        formID,
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
