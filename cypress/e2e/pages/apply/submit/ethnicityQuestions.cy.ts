import { generateApplication } from '../../../../../testUtils/applicationHelper';
import { generatePerson } from '../../../../../testUtils/personHelper';
import { faker } from '@faker-js/faker/locale/en_GB';
import { StatusCodes } from 'http-status-codes';

import EthnicityPage from '../../../../pages/ethnicity';
import { Errors } from '../../../../../lib/types/errors';
import DeclarationPage from '../../../../pages/declaration';
import Components from '../../../../pages/components';

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

describe('Ethnicity questions', () => {
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

    EthnicityPage.visit();
    EthnicityPage.getEthnicityPage().should('be.visible');

    cy.contains('Checking information…');
  });

  it('lets user fill in and submit their personal details when logged in', () => {
    cy.loginAsResident(applicationId, true);

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay
    );

    // nested form second patch
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    EthnicityPage.visit();
    EthnicityPage.getEthnicityPage().should('be.visible');

    Components.getRadioButtons().then((radioButtons) => {
      const randomIndex = Math.floor(Math.random() * radioButtons.length);
      radioButtons[randomIndex].click();
    });

    Components.getSaveButton().click();

    Components.getRadioButtons().then((radioButtons) => {
      const randomIndex = Math.floor(Math.random() * radioButtons.length);
      radioButtons[randomIndex].click();
    });

    Components.getSaveButton().click();

    cy.contains('Saving...');

    Components.getLoadingSpinner().should('not.exist');
    DeclarationPage.getDeclarationPage().should('be.visible');
  });

  it('shows an error message when patch is not fulfilled', () => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    const errorStatusCode = StatusCodes.BAD_REQUEST;

    const expectedErrorMessage = `Unable to update application (${errorStatusCode})`;

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay,
      errorStatusCode
    );

    EthnicityPage.visit();

    EthnicityPage.getErrorSummary().should('not.exist');

    Components.getRadioButtons().first().click();

    Components.getSaveButton().click();

    EthnicityPage.getErrorSummary().should('be.visible');
    cy.contains(expectedErrorMessage);
  });
  it('shows an error message when dispatch fails', () => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(applicationId, application);

    const errorStatusCode = StatusCodes.BAD_REQUEST;

    const expectedErrorMessage = Errors.GENERIC_ERROR;

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay,
      errorStatusCode
    );

    EthnicityPage.visit();

    EthnicityPage.getErrorSummary().should('not.exist');

    Components.getRadioButtons().first().click();

    Components.getSaveButton().click();

    EthnicityPage.getErrorSummary().should('be.visible');
    cy.contains(expectedErrorMessage);
  });
});
