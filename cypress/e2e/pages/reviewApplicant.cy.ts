import { faker } from '@faker-js/faker';

import { generateApplication } from '../../../testUtils/applicationHelper';
import ReviewApplicantPage from '../../pages/reviewApplicant';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();

const application = generateApplication(applicationId, personId);

describe('Review applicant details', () => {
  beforeEach(() => {
    cy.task('clearNock');
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    ReviewApplicantPage.mockHousingRegisterApiGetApplications(
      applicationId,
      application
    );
  });

  it('shows the money section for read only users', () => {
    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getMoneySectionNavLink().should('be.visible');
  });

  it('shows the health section for read only users', () => {
    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getHealthSectionNavLink().should('be.visible');
  });

  it("doesn't show the view documents button for read only users", () => {
    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getViewDocumentsButton().should('not.exist');
  });
});
