import StartPage from '../../pages/start';
import { generateApplication } from '../../../testUtils/applicationHelper';
import {
  generatePerson,
  getRandomGender,
  TitleEnum,
} from '../../../testUtils/personHelper';
import { faker } from '@faker-js/faker/locale/en_GB';
import AgreeTermsPage from '../../pages/agreeTerms';
import { StatusCodes } from 'http-status-codes';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const title = faker.helpers.enumValue(TitleEnum);
const birthDate = faker.date.birthdate({ mode: 'age', min: 18, max: 70 });
const mainApplicant = generatePerson(personId);
const apiResponseDelay = 1000;
const application = generateApplication(applicationId, personId, false, false);
const phoneNumber = faker.phone.number();

const applicationWithMainApplicant = {
  ...application,
  mainApplicant: {
    ...application.mainApplicant,
    contactInformation: {
      ...application.mainApplicant.contactInformation,
      phoneNumber: phoneNumber,
    },
    person: mainApplicant,
  },
  calculatedBedroomNeed: 1,
};

const fillInTheSignUpForm = () => {
  StartPage.getTitleDropdown().select(title);
  StartPage.getFirstNameInput().type(faker.person.firstName());
  StartPage.getLastNameInput().type(faker.person.lastName());
  StartPage.getDoBDayInput().type(birthDate.getDate().toString());
  StartPage.getDoBMonthInput().type((birthDate.getMonth() + 1).toString());
  StartPage.getDoBYearInput().type(birthDate.getFullYear().toString());
  StartPage.getGenderOptions().check(getRandomGender());
  StartPage.getNationalInsuranceNumberInput().type(
    faker.string.alphanumeric(9)
  );
  StartPage.getPhoneNumberInput().type(phoneNumber);
};

describe('Application', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.task('clearNock');
  });

  it('shows the loading spinner while application data is being fetched on the background', () => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      application,
      false,
      apiResponseDelay
    );

    StartPage.visit();
    cy.contains('Checking information…');
  });

  it('lets user fill in and submit their personal details when logged in', () => {
    //login with claims to specific application id
    cy.loginAsResident(applicationId, true);

    //initial GET request for start page
    cy.mockHousingRegisterApiGetApplications(applicationId, application);

    //PATCH request to update the application
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay
    );

    //second GET request for agree-terms page after the application has been patched
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    StartPage.visit();

    //fill in the personal details form and submit
    fillInTheSignUpForm();
    StartPage.getSubmitButton().click();

    //check that message is shown until (delayed) PATCH call has finished
    cy.contains('Saving...');

    //check that user is now on the agree-terms page
    AgreeTermsPage.getAgreeTermsPage().should('be.visible');
  });

  it('shows an error message when application update fails', () => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(applicationId, application);
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    const errorStatusCode = StatusCodes.BAD_REQUEST;

    //based on current API layer setup
    const expectedErrorMessage = `Unable to update application (${errorStatusCode})`;

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      null,
      apiResponseDelay,
      errorStatusCode
    );

    StartPage.visit();
    StartPage.getErrorSummary().should('not.exist');

    fillInTheSignUpForm();
    StartPage.getSubmitButton().click();

    StartPage.getErrorSummary().should('be.visible');
    cy.contains(expectedErrorMessage);
  });
});
