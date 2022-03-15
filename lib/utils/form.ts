import { Applicant, Application } from '../../domain/HousingApi';
import { getQuestionValue } from '../store/applicant';
import { FormData, FormField } from '../types/form';
import { FormID, getEligibilityCriteria } from './form-data';
import { isOver18 } from '../../lib/utils/dateOfBirth';
import { applicantsWithMedicalNeed } from '../../lib/utils/medicalNeed';
import { DisqualificationReason } from './disqualificationReasonOptions';

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

  const numberOfApplicantsWithMedicalNeeds =
    applicantsWithMedicalNeed(application);

  if (numberOfApplicantsWithMedicalNeeds > 0) {
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

  for (const [, formID] of Object.entries(FormID)) {
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
