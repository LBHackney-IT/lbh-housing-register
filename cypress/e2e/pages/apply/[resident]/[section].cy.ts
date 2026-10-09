import { faker } from '@faker-js/faker';
import { generateApplication } from '../../../../../testUtils/applicationHelper';
import ApplyHouseholdPage from '../../../../pages/household';
import ApplyExpectPage from '../../../../pages/apply/expect';
import ApplyOverviewPage from '../../../../pages/apply/overview';
import ApplyResidentIndexPage from '../../../../pages/apply/[resident]';
import { StatusCodes } from 'http-status-codes';
import ApplyResidentSectionPage from '../../../../pages/apply/[resident]/[section]';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, false);

//mark previous section as complete, so we can access one of the [section] page
const completedSections = [
  {
    answer: 'true',
    id: 'personal-details/sectionCompleted',
  },
];

const applicationWithCompletedMainApplicantSections = {
  ...application,
  mainApplicant: {
    ...application.mainApplicant,
    questions: completedSections,
  },
};

describe('Apply resident [section] page', () => {
  beforeEach(() => {
    cy.loginAsResident(applicationId, true);
    cy.clearE2eNock();
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      true,
    );
  });

  //applies to various section pages that share the same page
  it('shows saving message when user submits immigration status details', () => {
    //Application object does not reflect the correct state after patch, but it doesn't matter for this test
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      3000,
      StatusCodes.OK,
      false,
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getImmigrationStatusSectionLink().click();
    ApplyResidentSectionPage.getImmigrationStatusRadioButton(0).check();
    ApplyResidentSectionPage.getSubmitButton().click();

    cy.contains('Saving...');
  });

  it('shows error message when section data submit fails', () => {
    //Application object does not reflect the correct state after patch, but it doesn't matter for this test
    const errorCode = StatusCodes.CONFLICT;

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      0,
      errorCode,
      false,
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getImmigrationStatusSectionLink().click();
    ApplyResidentSectionPage.getImmigrationStatusRadioButton(0).check();
    ApplyResidentSectionPage.getSubmitButton().click();

    cy.contains(`Unable to update application (${errorCode})`);
  });
});

describe('signed-out and failed application loads', () => {
  const personId = faker.string.uuid();

  beforeEach(() => {
    cy.clearAllCookies();
  });

  it('sends a signed-out resident from residential status to sign in', () => {
    cy.visit(`/apply/${personId}/residential-status`);
    cy.location('pathname').should('eq', '/apply/sign-in');
    cy.get('body').should('not.contain', 'Unknown form step');
  });

  it('sends a signed-out resident from medical needs to sign in', () => {
    cy.visit(`/apply/${personId}/medical-needs`);
    cy.location('pathname').should('eq', '/apply/sign-in');
    cy.get('body').should('not.contain', 'Checking information');
  });
});

describe('loaded application section guards', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.loginAsResident(applicationId, true);
    cy.clearE2eNock();
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      true,
    );
  });

  it('still shows residential status after a refresh', () => {
    cy.visit(`/apply/${personId}/residential-status`);
    cy.contains('Residential status');
    cy.reload();
    cy.contains('Residential status');
    cy.get('body').should('not.contain', '404 Page not found');
  });

  it('shows a 404 for an unknown section', () => {
    cy.visit(`/apply/${personId}/navigation-status`);
    cy.contains('404 Page not found');
    cy.get('body').should('not.contain', 'Unknown form step');
  });

  it('shows a 404 when the resident is not on the application', () => {
    cy.visit(`/apply/${faker.string.uuid()}/residential-status`);
    cy.contains('404 Page not found');
  });

  it('shows a retry when the application load fails', () => {
    cy.clearE2eNock();
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      application,
      true,
      0,
      StatusCodes.INTERNAL_SERVER_ERROR,
    );

    cy.visit(`/apply/${personId}/medical-needs`);
    cy.contains('We could not load your application. Please try again.');
    cy.location('pathname').should('eq', `/apply/${personId}/medical-needs`);

    cy.clearE2eNock();
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      true,
    );

    cy.contains('button', 'Try again').click();
    cy.contains('Medical needs');
    cy.location('pathname').should('eq', `/apply/${personId}/medical-needs`);
    cy.get('body').should('not.contain', 'Unknown form step');
  });
});
