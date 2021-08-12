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
 * Get form IDs from the ApplicationSteps type
 * @param {ApplicationSectionGroup[]} sectionGroups Application steps
 * @returns {string[]} Workable form ids
 */
export const getFormIdsFromApplicationSections = (
  sectionGroups: ApplicationSectionGroup[]
): FormID[] => sectionGroups.flatMap((sg) => sg.sections.map((s) => s.id));
