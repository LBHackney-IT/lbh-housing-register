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
    cy.task('clearNock');
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      true
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
      false
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
      false
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
