import { faker } from '@faker-js/faker';
import ApplyHouseholdPage from '../../../../pages/household';
import { generateApplication } from '../../../../../testUtils/applicationHelper';
import ApplyResidentIndexPage from '../../../../pages/apply/[resident]';
import ApplyExpectPage from '../../../../pages/apply/expect';
import ApplyOverviewPage from '../../../../pages/apply/overview';
import ApplyResidentPersonalDetailsPage from '../../../../pages/apply/[resident]/personal-details';
import { StatusCodes } from 'http-status-codes';

const personId = faker.string.uuid();
const applicationId = faker.string.uuid();
const application = generateApplication(applicationId, personId, true, true);
const phoneNumber = faker.phone.number();

describe('Apply resident section page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.loginAsResident(applicationId, true);
    cy.clearE2eNock();
  });

  it('shows saving message when user submits the section', () => {
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(applicationId, application, 1000);

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
    ApplyResidentPersonalDetailsPage.getApplyResidentSectionPage().should(
      'be.visible',
    );
    cy.contains('Personal details');

    ApplyResidentPersonalDetailsPage.getPhoneNumberInput().type(phoneNumber);
    ApplyResidentPersonalDetailsPage.getSubmitButton().scrollIntoView().click();
    cy.contains('Saving...');
  });

  const openPersonalDetails = () => {
    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
    ApplyResidentPersonalDetailsPage.getApplyResidentSectionPage().should(
      'be.visible',
    );
  };

  it('locks the email address the resident signs in with', () => {
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);

    openPersonalDetails();

    ApplyResidentPersonalDetailsPage.getEmailInput().should(
      'have.attr',
      'readonly',
    );
    ApplyResidentPersonalDetailsPage.getEmailInput().should(
      'have.value',
      application.mainApplicant.contactInformation.emailAddress,
    );
    cy.contains(
      'You use this email address to sign in, so it cannot be changed.',
    );
  });

  it('leaves the email address editable when none has been saved yet', () => {
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      {
        ...application,
        mainApplicant: { ...application.mainApplicant, contactInformation: {} },
      },
      true,
    );

    openPersonalDetails();

    ApplyResidentPersonalDetailsPage.getEmailInput().should(
      'not.have.attr',
      'readonly',
    );
  });

  it('sends only the details a resident owns when saving', () => {
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(applicationId, application);
    cy.intercept('PATCH', '**/api/applications/*').as('saveApplication');

    openPersonalDetails();
    ApplyResidentPersonalDetailsPage.getPhoneNumberInput().type(phoneNumber);
    ApplyResidentPersonalDetailsPage.getSubmitButton().scrollIntoView().click();
    cy.wait('@saveApplication');

    cy.getE2eCapturedRequests(
      Cypress.expose('HOUSING_REGISTER_API') as string,
      'PATCH',
      `/applications/${applicationId}`,
    ).then((requests) => {
      const [{ body }] = requests as {
        body: {
          mainApplicant: Record<string, unknown>;
          otherMembers: Record<string, unknown>[];
        };
      }[];

      // Status, assessment, submittedAt and the like are set by the
      // backend or by staff, so a resident's save must never carry them.
      expect(body).to.have.all.keys('id', 'mainApplicant', 'otherMembers');
      const residentOwned = [
        'person',
        'address',
        'contactInformation',
        'questions',
      ];
      expect(residentOwned).to.include.members(Object.keys(body.mainApplicant));
      body.otherMembers.forEach((member) => {
        expect(residentOwned).to.include.members(Object.keys(member));
      });
    });
  });

  it('shows an error messages when the section save fails', () => {
    const errorCode = StatusCodes.CONFLICT;
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.mockHousingRegisterApiPatchApplication(
      applicationId,
      application,
      0,
      errorCode,
    );

    ApplyHouseholdPage.visit();
    ApplyHouseholdPage.getContinueToNextStepLink().scrollIntoView().click();
    ApplyExpectPage.getContinueToNextStepButton().click();
    ApplyOverviewPage.getApplicantButton(personId).click();
    ApplyResidentIndexPage.getPersonalDetailsSectionLink().click();
    ApplyResidentPersonalDetailsPage.getApplyResidentSectionPage().should(
      'be.visible',
    );
    cy.contains('Personal details');

    ApplyResidentPersonalDetailsPage.getPhoneNumberInput().type(phoneNumber);
    ApplyResidentPersonalDetailsPage.getSubmitButton().scrollIntoView().click();
    ApplyResidentPersonalDetailsPage.getErrorSummary().should('be.visible');
    cy.contains(`Unable to update application (${errorCode})`);
  });
});
