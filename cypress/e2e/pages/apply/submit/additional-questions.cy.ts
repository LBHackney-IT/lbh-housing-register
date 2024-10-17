import { generateApplication } from '../../../../../testUtils/applicationHelper';
import { generatePerson } from '../../../../../testUtils/personHelper';
import { faker } from '@faker-js/faker/locale/en_GB';
import AdditionalQuestionsPage from '../../../../pages/additionalQuestions';

import { Errors } from '../../../../../lib/types/errors';
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

describe('Additional questions', () => {
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

    AdditionalQuestionsPage.visit();
    AdditionalQuestionsPage.getAdditionalQuestionsPage().should('be.visible');

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

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    AdditionalQuestionsPage.visit();
    AdditionalQuestionsPage.getAdditionalQuestionsPage().should('be.visible');

    Components.getConditionalCheckboxes().first().click();
    AdditionalQuestionsPage.getAdditionalQuestionsNotes()
      .first()
      .scrollIntoView()
      .click()
      .type(faker.lorem.sentence());

    Components.getSaveButton().click();

    cy.contains('Saving...');

    Components.getLoadingSpinner().should('not.exist');
    EthnicityPage.getEthnicityPage().should('be.visible');
  });

  it('shows an error message when action fails', () => {
    cy.loginAsResident(applicationId, true);

    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      applicationWithMainApplicant
    );

    const errorStatusCode = StatusCodes.BAD_REQUEST;

    const expectedErrorMessage = `Unable to update application (${errorStatusCode})`;

    AdditionalQuestionsPage.visit();

    AdditionalQuestionsPage.getErrorSummary().should('not.exist');

    Components.getConditionalCheckboxes().first().click();
    AdditionalQuestionsPage.getAdditionalQuestionsNotes()
      .first()
      .scrollIntoView()
      .click()
      .type(faker.lorem.sentence());

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay,
      errorStatusCode
    );

    Components.getSaveButton().click();

    AdditionalQuestionsPage.getErrorSummary().should('be.visible');
    cy.contains(expectedErrorMessage);
  });
  it('shows an error message when dispatch fails', () => {
    cy.loginAsResident(applicationId, true);

    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);

    const expectedErrorMessage = Errors.GENERIC_ERROR;

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay
    );

    cy.mockActivityHistoryApiEmptyResponse(applicationId, true);

    AdditionalQuestionsPage.visit();

    AdditionalQuestionsPage.getErrorSummary().should('not.exist');

    Components.getConditionalCheckboxes().first().click();
    AdditionalQuestionsPage.getAdditionalQuestionsNotes()
      .first()
      .scrollIntoView()
      .click()
      .type(faker.lorem.sentence());

    Components.getSaveButton().click();

    AdditionalQuestionsPage.getErrorSummary().should('be.visible');
    cy.contains(expectedErrorMessage);
  });
});
