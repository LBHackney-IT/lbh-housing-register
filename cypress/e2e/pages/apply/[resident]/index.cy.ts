import { faker } from '@faker-js/faker';
import ApplyHouseholdPage from '../../../../pages/household';
import {
  completedApplicationFormSections,
  generateApplication,
} from '../../../../../testUtils/applicationHelper';
import { Application } from '../../../../../domain/HousingApi';
import { StatusCodes } from 'http-status-codes';
import ApplyResidentIndexPage from '../../../../pages/apply/[resident]';
import ApplyExpectPage from '../../../../pages/apply/expect';
import ApplyOverviewPage from '../../../../pages/apply/overview';
import ApplyResidentSummaryPage from '../../../../pages/apply/[resident]/summary';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, true);

//mark main applicant sections complete, so household member's section can be accessed
const applicationWithCompletedMainApplicantSections = {
  ...application,
  mainApplicant: {
    ...application.mainApplicant,
    questions: completedApplicationFormSections,
  },
};

//mock the object with household member removed
const applicationWithHouseholdMemberRemoved: Application = {
  ...applicationWithCompletedMainApplicantSections,
  otherMembers: [],
};

const householdMemberPersonId =
  applicationWithCompletedMainApplicantSections.otherMembers[0]!.person!.id;

/**
 * Each resident page mount runs `loadApplication()`; React Strict Mode in dev runs
 * effects twice per mount. One-shot GET mocks must not place a "next response"
 * (e.g. removed household) before navigation finishes, or the overview loads
 * the wrong application and applicant buttons are missing.
 */
function mockGetApplicationsCompletedMany(times: number) {
  Cypress._.times(times, () => {
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false,
    );
  });
}

describe('Apply resident index page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.loginAsResident(applicationId, true);
    cy.clearE2eNock();

    mockGetApplicationsCompletedMany(14);
  });

  it('shows a saving message while application is being updated', () => {
    //start from household overview page which loads the application from the database
    // this way we get the correct store state without having to mock it (which we don't have a setup yet)

    //mock the patch after deletion
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithHouseholdMemberRemoved,
      1000,
    );

    // GET after delete / return to overview (Strict Mode may fetch twice per mount)
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithHouseholdMemberRemoved,
      false,
    );
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithHouseholdMemberRemoved,
      false,
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(householdMemberPersonId).click();
    ApplyResidentIndexPage.getDeleteThisInformationButton().click();
    ApplyResidentIndexPage.getYesDeleteButton().click();

    cy.contains('Saving...');
  });

  it('shows an error message when deleting household member fails', () => {
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      1000,
      StatusCodes.CONFLICT,
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false,
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(householdMemberPersonId).click();
    ApplyResidentIndexPage.getDeleteThisInformationButton().click();
    ApplyResidentIndexPage.getYesDeleteButton().click();

    cy.contains('Unable to delete household member. Please try again.');
  });

  it('shows page not found when accessing the page directly', () => {
    ApplyResidentIndexPage.visit(personId);

    //expect 404 since the page won't have correct state
    cy.contains('404 Page not found');
  });

  it('redirects to summary page when applicant is not eligible to apply', () => {
    cy.clearE2eNock();
    const dateOfBirth = faker.date
      .birthdate({ mode: 'age', min: 1, max: 10 })
      .toISOString();

    const applicationWithNonEligibleApplicant: Application = {
      ...applicationWithHouseholdMemberRemoved,
      mainApplicant: {
        ...applicationWithHouseholdMemberRemoved.mainApplicant,
        person: {
          ...applicationWithHouseholdMemberRemoved.mainApplicant.person,
          dateOfBirth: dateOfBirth,
        },
      },
    };

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithNonEligibleApplicant,
      true,
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentSummaryPage.getApplyResidentSummaryPage().should('be.visible');
  });
});
