// import StartPage from '../../pages/start';
import { generateApplication } from '../../../testUtils/applicationHelper';
import { generatePerson } from '../../../testUtils/personHelper';
import { faker } from '@faker-js/faker/locale/en_GB';
import AgreeTermsPage from '../../pages/agreeTerms';
import ApplyHouseholdPage from '../../pages/household';
import { StatusCodes } from 'http-status-codes';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
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

const applicationWithMainApplicantAndAgreedTerms = {
  ...applicationWithMainApplicant,
  mainApplicant: {
    ...applicationWithMainApplicant.mainApplicant,
    questions: [
      {
        id: 'AGREEMENT/agree',
        answer: 'true',
      },
    ],
  },
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

    AgreeTermsPage.visit();
    AgreeTermsPage.getAgreeTermsPage().should('be.visible');

    cy.contains('Checking information…');
  });

  it('lets user fill in and submit their personal details when logged in', () => {
    //login with claims to specific application id
    cy.loginAsResident(applicationId, true);

    //initial GET request for agree-terms page
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    //PATCH request to update the application with agreed terms
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicantAndAgreedTerms,
      apiResponseDelay
    );

    //second GET request for household page after the application has been patched
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicantAndAgreedTerms
    );

    AgreeTermsPage.visit();

    // Agree to terms and submit
    AgreeTermsPage.getAgreeCheckbox().click();
    AgreeTermsPage.getAgreeButton().click();

    //check that message is shown until (delayed) PATCH call has finished
    cy.contains('Saving...');

    //check that user is now on the household member page
    ApplyHouseholdPage.getHouseholdPage().should('be.visible');
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

    AgreeTermsPage.visit();

    AgreeTermsPage.getErrorSummary().should('not.exist');

    AgreeTermsPage.getAgreeCheckbox().click();
    AgreeTermsPage.getAgreeButton().click();

    AgreeTermsPage.getErrorSummary().should('be.visible');
    cy.contains(expectedErrorMessage);
  });
});
