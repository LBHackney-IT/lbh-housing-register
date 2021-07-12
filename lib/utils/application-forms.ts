import { FormikValues } from 'formik';
import { Applicant } from '../../domain/HousingApi';
import { ApplicationStep, ApplicationSteps } from '../types/application';
import { IMMIGRATION_STATUS, RESIDENTIAL_STATUS } from './form-data';

/**
 * Get application step model from ID
 * @param {string} id The ID of the form step
 * @param {ApplicationSteps[]} steps The steps to check against
 * @returns {ApplicationStep}
 */
export const getApplicationStepFromId = (
  id: string,
  steps: ApplicationSteps[]
): ApplicationStep | undefined => {
  const activeSection = steps.filter(
    (step) => step.steps.filter((s) => s.id == id).length > 0
  )[0]?.steps;
  const activeStepModel = activeSection?.filter((step) => step.id == id)[0];
  return activeStepModel;
};

/**
 * Eligibility form steps
 * @returns {ApplicationSteps[]}
 */
export const getEligibilitySteps = (): ApplicationSteps[] => {
  return [
    {
      heading: 'Eligibility',
      steps: [
        {
          heading: 'Immigration status',
          id: IMMIGRATION_STATUS,
        },
      ],
    },
  ];
};

/**
 * Get form IDs from the ApplicationSteps type
 * @param {ApplicationSteps[]} steps Application steps
 * @returns {string[]} Workable form ids
 */
export const getFormIdsFromApplicationSteps = (
  steps: ApplicationSteps[]
): string[] => {
  const ids: string[] = [];
  steps.map((step) => step.steps.map((s) => ids.push(s.id)));
  return ids;
};

export function mapApplicantToValues(
  stepId: string,
  applicant: Applicant
): FormikValues {
  // TODO Lot's of specific forms are likely to want to map specific values here.

  return Object.fromEntries(
    (applicant.questions ?? [])
      .filter((question) => question.id?.startsWith(`${stepId}/`))
      .map((question) => [
        (question.id || '').slice(`${stepId}/`.length),
        JSON.parse(question.answer || 'null'),
      ])
  );
}
