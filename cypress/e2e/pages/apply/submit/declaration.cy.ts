import { generateApplication } from '../../../../../testUtils/applicationHelper';
import { generatePerson } from '../../../../../testUtils/personHelper';
import { faker } from '@faker-js/faker/locale/en_GB';
import { StatusCodes } from 'http-status-codes';

import DeclarationPage from '../../../../pages/declaration';
import Components from '../../../../pages/components';
import ConfirmationPage from '../../../../pages/confirmation';
import RejectionPage from '../../../../pages/rejection';

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

const dateOfBirth = new Date();
dateOfBirth.setFullYear(dateOfBirth.getFullYear() - 7);
const underEighteenDateOfBirth = dateOfBirth.toISOString();

const applicationWithNoNeed = {
  ...applicationWithMainApplicant,
  mainApplicant: {
    ...applicationWithMainApplicant.mainApplicant,
    person: {
      ...applicationWithMainApplicant.mainApplicant.person,
      dateOfBirth: underEighteenDateOfBirth,
    },
  },
  calculatedBedroomNeed: 0,
};

describe('Declaration', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearE2eNock();
    cy.mockNotifyEmailResponse(200);
  });

  it('shows the loading spinner while application data is being fetched on the background', () => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      application,
      false,
      apiResponseDelay,
    );

    DeclarationPage.visit();
    DeclarationPage.getDeclarationPage().should('be.visible');

    cy.contains('Checking information…');
  });

  it('lets user accept declaration when signed in', () => {
    cy.loginAsResident(applicationId, true);

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant,
    );

    // /api/notify/new-application now looks up the application itself
    // (rather than trusting the client-supplied body), so it makes its own
    // GET /applications/{id} call - this covers that, in addition to the
    // page's own load above.
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant,
    );

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay,
    );

    cy.mockHousingRegisterApiPostEvidenceRequest(
      applicationId,
      apiResponseDelay,
    );

    cy.mockHousingRegisterApiPatchCompleteApplication(
      applicationId,
      apiResponseDelay,
    );

    cy.intercept('POST', '**/api/notify/new-application').as(
      'sendConfirmation',
    );

    DeclarationPage.visit();
    DeclarationPage.getDeclarationPage().should('be.visible');

    Components.getCheckboxes().first().click();

    Components.getSaveButton().click();

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant,
    );

    cy.contains('Saving...');

    // Proves /api/notify/new-application authorised the request and
    // successfully looked up the application server-side, rather than
    // failing (e.g. because a mocked backend call ran out) and silently
    // being swallowed by code that never checks the dispatch result.
    cy.wait('@sendConfirmation').its('response.statusCode').should('eq', 200);

    ConfirmationPage.getConfirmationPage().should('be.visible');
    Components.getLoadingSpinner().should('not.exist');
  });

  it('shows user rejected declaration when signed in', () => {
    cy.loginAsResident(applicationId, true);

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithNoNeed,
    );

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithNoNeed,
    );

    cy.intercept('POST', '**/api/notify/disqualify').as('sendDisqualify');

    DeclarationPage.visit();
    DeclarationPage.getDeclarationPage().should('be.visible');

    Components.getCheckboxes().first().click();

    // Two GETs are needed from here: one made by /api/notify/disqualify
    // itself (it now looks up the application server-side rather than
    // trusting the client body) and one for the RejectionPage load after
    // redirect.
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithNoNeed,
    );
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithNoNeed,
    );

    Components.getSaveButton().click();
    Components.getLoadingSpinner().should('be.visible');

    // Proves /api/notify/disqualify authorised the request and successfully
    // looked up the application server-side, rather than failing (e.g.
    // because a mocked backend call ran out) and silently being swallowed
    // by code that never checks the dispatch result.
    cy.wait('@sendDisqualify').its('response.statusCode').should('eq', 200);

    RejectionPage.getRejectionPage().should('be.visible');
    Components.getLoadingSpinner().should('not.exist');
  });

  it('shows an error message when cannot complete successful application', () => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant,
    );

    const errorStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    const expectedErrorMessage = `Unable to complete application (${errorStatusCode})`;

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant,
    );

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay,
    );

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant,
    );

    cy.mockHousingRegisterApiPostEvidenceRequest(
      applicationId,
      apiResponseDelay,
      errorStatusCode,
    );

    cy.mockHousingRegisterApiPatchCompleteApplication(
      applicationId,
      apiResponseDelay,
      errorStatusCode,
    );

    DeclarationPage.visit();
    DeclarationPage.getDeclarationPage().should('be.visible');

    Components.getCheckboxes().first().click();

    Components.getSaveButton().click();

    DeclarationPage.getErrorSummary().should('be.visible');
    cy.contains(expectedErrorMessage);
  });
  it('shows an error message when cannot complete rejected application', () => {
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithNoNeed,
    );

    const errorStatusCode = StatusCodes.INTERNAL_SERVER_ERROR;

    const expectedErrorMessage = `Unable to complete application (${errorStatusCode})`;

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithNoNeed,
    );

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithNoNeed,
      apiResponseDelay,
      errorStatusCode,
    );

    DeclarationPage.visit();
    DeclarationPage.getDeclarationPage().should('be.visible');

    Components.getCheckboxes().first().click();

    Components.getSaveButton().click();

    DeclarationPage.getErrorSummary().should('be.visible');
    cy.contains(expectedErrorMessage);
  });
});
