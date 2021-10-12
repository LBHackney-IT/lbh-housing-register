import { Application } from '../../domain/HousingApi';

/**
 * Get the applicants name as a string, with household members in brackets.
 * @param {Application} application The application
 * @returns {string}
 */
export function getPersonName(application: Application | undefined): string {
  if (!application?.mainApplicant?.person) return '';
  let person = application?.mainApplicant?.person;
  let name = `${person.title} ${person.firstName} ${person.surname}`;
  if (application.otherMembers && application.otherMembers.length > 0) {
    name += ` (+${application.otherMembers?.length})`;
  }
  return name;
}
