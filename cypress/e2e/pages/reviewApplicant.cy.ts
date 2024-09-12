import { faker } from '@faker-js/faker';

import { generateApplication } from '../../../testUtils/applicationHelper';
import ReviewApplicantPage from '../../pages/reviewApplicant';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();

const application = generateApplication(applicationId, personId);

describe.skip('Review applicant details', () => {
  it('shows correct tabs for read only users', () => {
    cy.task('clearNock');
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    cy.mockHousingRegisterApiGetApplications(applicationId, application);

    ReviewApplicantPage.visit(applicationId, personId);
    ReviewApplicantPage.getMoneySectionNavLink().should('be.visible');
    ReviewApplicantPage.getHealthSectionNavLink().should('be.visible');
    ReviewApplicantPage.getViewDocumentsButton().should('not.exist');
  });
});
