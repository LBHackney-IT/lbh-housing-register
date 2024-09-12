import { faker } from '@faker-js/faker';

import { ApplicationStatus } from '../../../lib/types/application-status';
import { generateApplication } from '../../../testUtils/applicationHelper';
import ViewApplicationPage from '../../pages/viewApplication';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const application = generateApplication(applicationId, personId);
//ensure application requires assessment
application.status = ApplicationStatus.SUBMITTED;

describe('View a resident application', () => {
  beforeEach(() => {
    cy.task('clearNock');
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');

    cy.mockHousingRegisterApiGetApplications(applicationId, application);
    cy.mockActivityHistoryApiEmptyResponse(applicationId);
  });
  it('does not show the assessment area for read only users', () => {
    ViewApplicationPage.visit(applicationId);
    ViewApplicationPage.getAssessmentNavLink().should('not.exist');
  });
});
