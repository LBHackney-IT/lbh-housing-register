import { faker } from '@faker-js/faker';

describe('Edit main applicant', () => {
  it('shows access denied page for user with read only permissions', () => {
    const applicationId = faker.string.uuid();
    const mainApplicantId = faker.string.uuid();

    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.visit(`applications/edit/${applicationId}/${mainApplicantId}`);
    cy.contains('Access denied');
  });
});
