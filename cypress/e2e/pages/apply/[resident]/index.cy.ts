/* eslint-disable */

import { faker } from '@faker-js/faker';
import HouseholdPage from '../../../../pages/household';
import {
  completedApplicationFormSections,
  generateApplication,
} from '../../../../../testUtils/applicationHelper';
import { Application } from '../../../../../domain/HousingApi';
import { StatusCodes } from 'http-status-codes';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, true);

//mark main applicant sections complete, so household member can be accessed
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

describe('Apply resident index page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.loginAsResident(applicationId, true);
    cy.task('clearNock');
  });

  it('shows a saving message while application is being updated', () => {
    //start from household overview page which loads the application from the database
    // this way we get the correct store state without having to mock it (which we don't have a setup yet)

    //cover the initial page load GET calls
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false
    );
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false
    );

    //mock the patch after deletion
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithHouseholdMemberRemoved,
      2000
    );

    //mock the GET after removing household member
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithHouseholdMemberRemoved,
      false
    );

    HouseholdPage.visit();
    //HouseholdPage.getContinueToNextStepLink().click();
    cy.get('.lbh-button')
      .contains('Continue to next step')
      .scrollIntoView()
      .click();
    cy.get('.lbh-button')
      .contains('Save and continue')
      .scrollIntoView()
      .click();

    const householdMemberName = `${application.otherMembers[0].person.firstName} ${application.otherMembers[0].person.surname}`;
    cy.get('.lbh-applicant-summary__name')
      .contains(householdMemberName)
      .click();
    cy.get('button').contains('Delete this information').click();
    cy.get('button').contains('Yes').click();

    cy.contains('Saving...');
  });

  it('shows an error message when deleting household member fails', () => {
    //start from household overview page which loads the application from the database
    // this way we get the correct store state without having to mock it (which we don't have a setup yet)

    //cover the initial page load GET calls
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false
    );
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithCompletedMainApplicantSections,
      false
    );

    //mock the patch after deletion
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithHouseholdMemberRemoved,
      2000,
      StatusCodes.CONFLICT
    );

    //mock the GET after removing household member
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithHouseholdMemberRemoved,
      false
    );

    HouseholdPage.visit();
    //HouseholdPage.getContinueToNextStepLink().click();
    cy.get('.lbh-button')
      .contains('Continue to next step')
      .scrollIntoView()
      .click();
    cy.get('.lbh-button')
      .contains('Save and continue')
      .scrollIntoView()
      .click();

    const householdMemberName = `${application.otherMembers[0].person.firstName} ${application.otherMembers[0].person.surname}`;
    cy.get('.lbh-applicant-summary__name')
      .contains(householdMemberName)
      .click();
    cy.get('button').contains('Delete this information').click();
    cy.get('button').contains('Yes').click();

    cy.contains('Unable to delete household member. Please try again.');
  });

  //TODO: test accessing page directly
});
