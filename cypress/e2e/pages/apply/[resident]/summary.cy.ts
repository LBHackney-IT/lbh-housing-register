import { faker } from '@faker-js/faker';
import {
  completedApplicationFormSections,
  generateApplication,
} from '../../../../../testUtils/applicationHelper';
import ApplyHouseholdPage from '../../../../pages/household';
import ApplyExpectPage from '../../../../pages/apply/expect';
import ApplyOverviewPage from '../../../../pages/apply/overview';
import ApplyResidentIndexPage from '../../../../pages/apply/[resident]';
import { StatusCodes } from 'http-status-codes';
import ApplyResidentSummaryPage from '../../../../pages/apply/[resident]/summary';
import { Application, Person } from '../../../../../domain/HousingApi';
import { generatePerson } from '../../../../../testUtils/personHelper';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, false);
const birthDateUnder18 = faker.date.birthdate({ mode: 'age', min: 1, max: 17 });
const birthDateOver55 = faker.date.birthdate({
  mode: 'age',
  min: 56,
  max: 100,
});

const ineligibleApplicationWithCompletedMainApplicantSections: Application = {
  ...application,
  mainApplicant: {
    ...application.mainApplicant,
    person: {
      ...application.mainApplicant.person,
      dateOfBirth: birthDateUnder18,
    },
    questions: completedApplicationFormSections,
  },
};

const eligibleApplicationWithCompletedMainApplicantSections: Application = {
  ...application,
  mainApplicant: {
    ...application.mainApplicant,
    person: {
      ...application.mainApplicant.person,
      dateOfBirth: birthDateOver55,
    },
    questions: completedApplicationFormSections,
  },
};

describe('Apply resident summary page', () => {
  beforeEach(() => {
    cy.loginAsResident(applicationId, true);
    cy.task('clearNock');
    cy.mockNotifyEmailResponse();
  });

  it('shows saving message when user confirms the resident details and is not eligible to apply', () => {
    //Application object does not reflect the correct state after patch, but it doesn't matter for this test
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      ineligibleApplicationWithCompletedMainApplicantSections,
      1000,
      StatusCodes.OK,
      false
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      ineligibleApplicationWithCompletedMainApplicantSections,
      true
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentSummaryPage.getConfirmDetailsButton().click();

    cy.contains('Saving...');
  });

  it('shows an error message when application save fails and user is not eligible to apply', () => {
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      ineligibleApplicationWithCompletedMainApplicantSections,
      0,
      StatusCodes.CONFLICT,
      false
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      ineligibleApplicationWithCompletedMainApplicantSections,
      true
    );

    cy.mockNotifyEmailResponse();

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentSummaryPage.getConfirmDetailsButton().click();

    cy.contains('Unable to update application');
  });

  it('redirects eligible user to person overview page after they confirm their details', () => {
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      eligibleApplicationWithCompletedMainApplicantSections,
      0,
      StatusCodes.OK,
      false
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      eligibleApplicationWithCompletedMainApplicantSections,
      true
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getCheckAnswersButton().click();
    ApplyResidentSummaryPage.getConfirmDetailsButton().click();
    ApplyOverviewPage.getApplyOverviewPage().should('be.visible');
  });

  it('shows saving message when user deletes a household member from the application', () => {
    //complete household member sections, so summary page is available
    const householdMember: Person = generatePerson(personId + 1);

    const eligibleApplicationWithHouseholdMemberCompleted: Application = {
      ...eligibleApplicationWithCompletedMainApplicantSections,
      otherMembers: [
        {
          person: householdMember,
          contactInformation: {
            emailAddress: faker.internet.email({
              provider: 'hackneyTEST.gov.uk',
            }),
          },
          questions: [
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
              id: 'address-history/sectionCompleted',
            },
            {
              answer: 'true',
              id: 'employment/sectionCompleted',
            },
          ],
        },
      ],
    };

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      eligibleApplicationWithHouseholdMemberCompleted,
      1000,
      StatusCodes.OK,
      false
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      eligibleApplicationWithHouseholdMemberCompleted,
      true
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(householdMember.id).click();
    ApplyResidentIndexPage.getCheckAnswersButton().click();
    ApplyResidentSummaryPage.getDeleteThisInformationButton().click();
    ApplyResidentSummaryPage.getYesDeleteInformationButton().click();

    cy.contains('Saving...');
  });
});
