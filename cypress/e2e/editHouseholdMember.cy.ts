import { faker } from '@faker-js/faker';

describe('Edit household member', () => {
  it('shows access denied page for user with read only permissions', () => {
    const applicationId = faker.string.uuid();
    const personId = faker.string.uuid();

    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.visit(
      `applications/edit/${applicationId}/${personId}/edit-household-member`
    );
    cy.contains('Access denied');
  });
});
