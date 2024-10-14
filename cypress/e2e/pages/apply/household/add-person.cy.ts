import { faker } from '@faker-js/faker';
import HouseholdPage from '../../../../pages/household';
import { generateApplication } from '../../../../../testUtils/applicationHelper';
import AddPersonPage from '../../../../pages/addPerson';
import Components from '../../../../pages/components';
import { generatePerson } from '../../../../../testUtils/personHelper';

import { StatusCodes } from 'http-status-codes';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, true);
const phoneNumber = faker.phone.number();
const mainApplicant = generatePerson(personId);
const apiResponseDelay = 1000;

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

describe('Add person to household ', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.task('clearNock');
    cy.loginAsResident(applicationId, true);
  });
  it('shows a saving message while application is being updated', () => {
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay
    );

    HouseholdPage.visit();
    HouseholdPage.getHouseholdPage().should('be.visible');

    AddPersonPage.visit();
    AddPersonPage.getAddPersonPage().should('be.visible');

    Components.getSelect('title').select(1);
    Components.getInput('firstName').type(faker.person.firstName());
    Components.getInput('surname').type(faker.person.lastName());
    Components.getDateInput('day').type(
      faker.number.int({ max: 28, min: 1 }).toString()
    );
    Components.getDateInput('month').type(
      faker.number.int({ max: 12, min: 1 }).toString()
    );
    Components.getDateInput('year').type(
      faker.number.int({ max: 2004, min: 1912 }).toString()
    );
    Components.getSelect('relationshipType').select(1);

    Components.getRadioButtons().first().click('left');

    Components.getSaveButton().click();

    Components.getLoadingSpinner().should('not.exist');
    HouseholdPage.getHouseholdPage().should('be.visible');
  });
  it('shows an error message with correct status code when application update fails', () => {
    const errorCode = StatusCodes.FORBIDDEN;

    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay,
      errorCode
    );

    HouseholdPage.visit();
    HouseholdPage.getHouseholdPage().should('be.visible');

    AddPersonPage.visit();
    AddPersonPage.getAddPersonPage().should('be.visible');

    Components.getSelect('title').select(1);
    Components.getInput('firstName').type(faker.person.firstName());
    Components.getInput('surname').type(faker.person.lastName());
    Components.getDateInput('day').type(
      faker.number.int({ max: 28, min: 1 }).toString()
    );
    Components.getDateInput('month').type(
      faker.number.int({ max: 12, min: 1 }).toString()
    );
    Components.getDateInput('year').type(
      faker.number.int({ max: 2004, min: 1912 }).toString()
    );
    Components.getSelect('relationshipType').select(1);

    Components.getRadioButtons().first().click('left');

    Components.getSaveButton().click();

    Components.getLoadingSpinner().should('not.exist');

    Components.getErrorSumamry('add-person').should('be.visible');
    cy.contains(`Unable to update application (${errorCode})`);
  });
});
