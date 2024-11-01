import { faker } from '@faker-js/faker';
import AddCasePage from '../../../pages/applications/add-case';
import { generatePerson, TitleEnum } from '../../../../testUtils/personHelper';
import { generateApplication } from '../../../../testUtils/applicationHelper';
import { StatusCodes } from 'http-status-codes';

const title = faker.helpers.enumValue(TitleEnum);
const birthDate = faker.date.birthdate({ mode: 'age', min: 18, max: 70 });
const personId = faker.string.uuid();
const person = generatePerson(personId);
const applicationId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, false);

//generic error code returned by the current API layer on failure for affected endpoints
const errorCode = StatusCodes.INTERNAL_SERVER_ERROR;

const fillInTheCaseForm = () => {
  AddCasePage.getTitleDropdown().select(title);
  AddCasePage.getFirstNameInput().type(person.firstName);
  AddCasePage.getLastNameInput().type(person.surname);
  AddCasePage.getDoBDayInput().type(birthDate.getDate().toString());
  AddCasePage.getDoBMonthInput().type((birthDate.getMonth() + 1).toString());
  AddCasePage.getDoBYearInput().type(birthDate.getFullYear().toString());
  AddCasePage.getGenderDropdown().select(person.gender);
  AddCasePage.getLivingSituationDropdown().select('private-rental');
  AddCasePage.getCitizenshipDropdown().select('british');
  AddCasePage.getAddAddressButton().click();
  AddCasePage.getAddressLine1Input().type('line 1');
  AddCasePage.getSaveAddressButton().scrollIntoView().click();
};

describe('Add case', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.task('clearNock');
    cy.loginAsUser('manager');
    cy.mockActivityHistoryApiEmptyResponse(applicationId);
    cy.mockHousingRegisterApiGetApplications(applicationId, application);
  });

  it('shows access denied page for user with read only permissions', () => {
    cy.clearAllCookies();
    cy.loginAsUser('readOnly');
    AddCasePage.visit();
    cy.contains('Access denied');
  });

  it('shows saving message while application is created', () => {
    //mock object does not follow the real shape changes between actions.
    // These are just for getting the UI to run for this particular test
    cy.mockHousingRegisterApiPostApplication(application, 1000);
    cy.mockHousingRegisterApiCompleteApplication(
      applicationId,
      application,
      1000
    );
    cy.mockHousingRegisterApiPatchApplication(applicationId, application, 1000);

    AddCasePage.visit();
    fillInTheCaseForm();
    AddCasePage.getSubmitButton().click();

    cy.contains('Saving...');
  });

  it('shows an error when application creation fails', () => {
    cy.mockHousingRegisterApiPostApplication(application, 0, errorCode);

    AddCasePage.visit();
    fillInTheCaseForm();
    AddCasePage.getSubmitButton().click();

    cy.contains(`Unable to create application (${errorCode})`);
  });

  it('shows an error when application completion fails', () => {
    cy.mockHousingRegisterApiPostApplication(application, 0);
    cy.mockHousingRegisterApiCompleteApplication(
      applicationId,
      application,
      0,
      errorCode
    );

    AddCasePage.visit();
    fillInTheCaseForm();
    AddCasePage.getSubmitButton().click();

    cy.contains(`Unable to complete application (${errorCode})`);
  });

  it('shows an error when application update to manual draft status fails', () => {
    cy.mockHousingRegisterApiPostApplication(application, 0);
    cy.mockHousingRegisterApiCompleteApplication(applicationId, application, 0);
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      0,
      errorCode
    );

    AddCasePage.visit();
    fillInTheCaseForm();

    AddCasePage.getSubmitButton().click();

    cy.contains(`Unable to update application (${errorCode})`);
  });
});
