import { faker } from '@faker-js/faker';

import { generateApplication } from '../../../testUtils/applicationHelper';
import ReviewApplicantPage from '../../pages/reviewApplicant';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();

const application = generateApplication(applicationId, personId);

describe('Review applicant details', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.task('clearNock');
    ReviewApplicantPage.mockHousingRegisterApiGetApplications(
      applicationId,
      application
    );
  });

  it("doesn't show the money section for read only users", () => {
    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getMoneySectionNavLink().should('not.exist');
  });

  it("doesn't show the health section for read only users", () => {
    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getHealthSectionNavLink().should('not.exist');
  });
});
