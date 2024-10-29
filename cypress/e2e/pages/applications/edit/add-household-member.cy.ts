import { faker } from '@faker-js/faker';
import AddHouseholdMemberPage from '../../../../pages/applications/edit/add-household-member';
import { generateApplication } from '../../../../../testUtils/applicationHelper';
import {
  generatePerson,
  TitleEnum,
} from '../../../../../testUtils/personHelper';
import ViewApplicationPage from '../../../../pages/viewApplication';
import { StatusCodes } from 'http-status-codes';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const application = generateApplication(applicationId, personId);
const person = generatePerson(personId);

//matches values available in this form rather than what Person.TitleEnum has
const title = faker.helpers.enumValue(TitleEnum);
const birthDate = faker.date.birthdate({ mode: 'age', min: 18, max: 70 });

//populate required fields, so household member can be added
const fillInHouseholdMemberForm = () => {
  AddHouseholdMemberPage.getTitleDropdown().select(title);
  AddHouseholdMemberPage.getFirstNameInput().type(person.firstName);
  AddHouseholdMemberPage.getLastNameInput().type(person.surname);
  AddHouseholdMemberPage.getDoBDayInput().type(birthDate.getDate().toString());
  AddHouseholdMemberPage.getDoBMonthInput().type(
    (birthDate.getMonth() + 1).toString()
  );
  AddHouseholdMemberPage.getDoBYearInput().type(
    birthDate.getFullYear().toString()
  );
  AddHouseholdMemberPage.getGenderDropdown().select(person.gender);
};

describe('Add household member', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.task('clearNock');
    cy.loginAsUser('manager');
  });

  it('shows saving message while application is being saved', () => {
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockActivityHistoryApiEmptyResponse(applicationId);

    //mocking patch response with the same object as get for the purpose of this test
    cy.mockHousingRegisterApiPatchApplication(applicationId, application, 1000);

    AddHouseholdMemberPage.visit(applicationId);
    fillInHouseholdMemberForm();
    AddHouseholdMemberPage.getSubmitButton().click();
    // cy.contains('Saving...');
    cy.contains('Test failure');

    ViewApplicationPage.getViewApplicationPage().should('be.visible');
  });

  it('shows error message with correct status code when adding the household member fails', () => {
    const errorCode = StatusCodes.CONFLICT;
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      0,
      errorCode
    );

    AddHouseholdMemberPage.visit(applicationId);
    fillInHouseholdMemberForm();
    AddHouseholdMemberPage.getSubmitButton().click();

    cy.contains(`Unable to update application (${errorCode})`);
    AddHouseholdMemberPage.getErrorSummary().should('be.visible');
  });
});
