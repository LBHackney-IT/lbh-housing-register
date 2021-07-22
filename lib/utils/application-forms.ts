import { FormikValues } from 'formik';
import { Applicant } from '../../domain/HousingApi';
import {
  ApplicationSection,
  ApplicationSectionGroup,
} from '../types/application';
import { FormID } from './form-data';

/**
 * Get application step model from ID
 * @param {string} id The ID of the form step
 * @param {ApplicationSectionGroup[]} sectionGroups The steps to check against
 * @returns {ApplicationSection}
 */
export const getApplicationSectionFromId = (
  id: string,
  sectionGroups: ApplicationSectionGroup[]
): ApplicationSection | undefined =>
  sectionGroups.flatMap((sg) => sg.sections).find((s) => s.id === id);

/**
 * Eligibility form steps
 * @returns {ApplicationSectionGroup[]}
 */
export const getEligibilitySections = (): ApplicationSectionGroup[] => {
  return [
    {
      heading: 'Eligibility',
      sections: [
        {
          heading: 'Immigration status',
          id: FormID.IMMIGRATION_STATUS,
        },
      ],
    },
  ];
};

/**
 * Get form IDs from the ApplicationSteps type
 * @param {ApplicationSectionGroup[]} sectionGroups Application steps
 * @returns {string[]} Workable form ids
 */
export const getFormIdsFromApplicationSections = (
  sectionGroups: ApplicationSectionGroup[]
): FormID[] => sectionGroups.flatMap((sg) => sg.sections.map((s) => s.id));

export function mapApplicantToValues(
  stepId: string, // todo FormID
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
