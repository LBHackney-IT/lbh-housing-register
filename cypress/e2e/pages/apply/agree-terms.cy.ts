import { generateApplication } from '../../../../testUtils/applicationHelper';
import { generatePerson } from '../../../../testUtils/personHelper';
import { faker } from '@faker-js/faker/locale/en_GB';
import AgreeTermsPage from '../../../pages/agreeTerms';
import HouseholdPage from '../../../pages/household';
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

describe('Agree terms', () => {
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

  it('lets user agree to terms when logged in', () => {
    cy.loginAsResident(applicationId, true);

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicantAndAgreedTerms,
      apiResponseDelay
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicantAndAgreedTerms
    );

    AgreeTermsPage.visit();

    AgreeTermsPage.getAgreeCheckbox().click();
    AgreeTermsPage.getAgreeButton().click();

    cy.contains('Saving...');

    HouseholdPage.getHouseholdPage().should('be.visible');
  });

  it('shows an error message when agree terms update fails', () => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(applicationId, application);
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    const errorStatusCode = StatusCodes.BAD_REQUEST;

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
