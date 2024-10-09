import { faker } from '@faker-js/faker';
import HouseholdPage from '../../../../pages/household';
import { generateApplication } from '../../../../../testUtils/applicationHelper';
import AddPersonPage from '../../../../pages/addPerson';
import Components from '../../../../pages/components';
import { generatePerson } from '../../../../../testUtils/personHelper';

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

describe('Application: Add person to household ', () => {
  it('shows a saving message while application is being updated', () => {
    //start from household overview page which loads the application from the database
    // this way we get the correct store state without having to mock it (which we don't have a setup yet)
    cy.loginAsResident(applicationId, true);
    cy.mockHousingRegisterApiGetApplications(applicationId, application);
    cy.mockHousingRegisterApiGetApplications(applicationId, application);

    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      applicationWithMainApplicant,
      apiResponseDelay
    );
    cy.mockHousingRegisterApiGetApplications(applicationId, application);

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
  });
});
