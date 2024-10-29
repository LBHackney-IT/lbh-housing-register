import { faker } from '@faker-js/faker';

describe('Add household member', () => {
  it('shows access denied page for user with read only permissions', () => {
    const applicationId = faker.string.uuid();

    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.visit(`applications/edit/${applicationId}/add-household-member`);
    cy.contains('Access denied');
  });
});
