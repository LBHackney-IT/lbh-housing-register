import ReviewApplicantPage from '../pages/reviewApplicant';

describe('Review applicant details', () => {
  it("doesn't show the money section for read only users", () => {
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');

    ReviewApplicantPage.visit();
    ReviewApplicantPage.getMoneySectionNavLink().should('not.exist');
  });

  it("doesn't show the health section for read only users", () => {
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');

    ReviewApplicantPage.visit();
    ReviewApplicantPage.getHealthSectionNavLink().should('not.exist');
  });
});
