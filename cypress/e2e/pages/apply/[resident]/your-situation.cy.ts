import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import { generateApplication } from '../../../../../testUtils/applicationHelper';
import ApplyHouseholdPage from '../../../../pages/household';
import ApplyExpectPage from '../../../../pages/apply/expect';
import ApplyOverviewPage from '../../../../pages/apply/overview';
import ApplyResidentIndexPage from '../../../../pages/apply/[resident]';
import ApplyResidentYourSituationPage from '../../../../pages/apply/[resident]/your-situation';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, false);

//mark previous sections as complete, so we can access the your situation section
const completedSections = [
  {
    answer: 'true',
    id: 'personal-details/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'immigration-status/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'medical-needs/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'residential-status/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'address-history/sectionCompleted',
  },
  {
    answer: 'true',
    id: 'current-accommodation/sectionCompleted',
  },
];

const applicationWithCompletedMainApplicantSections = {
  ...application,
  mainApplicant: {
    ...application.mainApplicant,
    questions: completedSections,
  },
};

describe('Apply resident your situation page', () => {
  beforeEach(() => {
    cy.loginAsResident(applicationId, true);
    cy.task('clearNock');
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      true
    );
  });

  it('shows saving message when user submits your situation details form', () => {
    //Application object does not reflect the correct state after patch, but it doesn't matter for this test
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      1000,
      StatusCodes.OK,
      true
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getYourSituationSectionLink().click();
    ApplyResidentYourSituationPage.getServedInArmedForcesRadioButton().check();
    ApplyResidentYourSituationPage.getSubmitButton().click();
    cy.contains('Saving...');
  });

  it('shows saving message when user submits the last section form', () => {
    //Application object does not reflect the correct state after patch, but it doesn't matter for this test
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      1000,
      StatusCodes.OK,
      true
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getYourSituationSectionLink().click();

    ApplyResidentYourSituationPage.getServedInArmedForcesRadioButton().check();
    ApplyResidentYourSituationPage.getSubmitButton().click();
    ApplyResidentYourSituationPage.getIntentionallyHomelessRadioButton(
      1
    ).check();
    ApplyResidentYourSituationPage.getSubmitButton().click();
    ApplyResidentYourSituationPage.getOwnPropertyRadioButton(1).check();
    ApplyResidentYourSituationPage.getSubmitButton().click();
    ApplyResidentYourSituationPage.getSoldPropertyRadioButton(1).check();
    ApplyResidentYourSituationPage.getSubmitButton().click();
    ApplyResidentYourSituationPage.getRentArrearsRadioButton(1).check();
    ApplyResidentYourSituationPage.getSubmitButton().click();
    ApplyResidentYourSituationPage.getBreachOfTenancyRadioButton(1).check();
    ApplyResidentYourSituationPage.getSubmitButton().click();
    ApplyResidentYourSituationPage.getSubmitButton().click();
    ApplyResidentYourSituationPage.getLegalRestrictionsRadioButton(1).check();
    ApplyResidentYourSituationPage.getSubmitButton().click();
    ApplyResidentYourSituationPage.getUnspentConvictionsRadioButton(1).check();
    //last form page, triggers exit flow
    ApplyResidentYourSituationPage.getSubmitButton().click();
    cy.contains('Saving...');
  });

  it('shows page not found when accessed directly', () => {
    ApplyResidentYourSituationPage.visit(personId);
    cy.contains('404 Page not found');
  });
});
