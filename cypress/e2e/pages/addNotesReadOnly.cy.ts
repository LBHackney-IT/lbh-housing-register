import { faker } from '@faker-js/faker';

import { generateApplication } from '../../../testUtils/applicationHelper';
import ReviewApplicantPage from '../../pages/reviewApplicant';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();

const application = generateApplication(applicationId, personId);

describe('Review applicant notes', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.task('clearNock');
    ReviewApplicantPage.mockHousingRegisterApiGetApplications(
      applicationId,
      application
    );
  });

  it("doesn't show the notes section for read only users", () => {
    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getNotesSection().should('not.exist');
  });
});
