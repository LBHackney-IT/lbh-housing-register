import { faker } from '@faker-js/faker';
import VerifyPage from '../../pages/verify';
import SignInPage from '../../pages/signIn';
import { generateApplication } from '../../../testUtils/applicationHelper';
import StartPage from '../../pages/start';
import { generateEmailAddress } from '../../../testUtils/personHelper';
import { StatusCodes } from 'http-status-codes';

const applicationId = faker.string.uuid();
const personId = faker.string.uuid();
const application = generateApplication(
  applicationId,
  personId,
  false,
  false,
  false
);
const email = generateEmailAddress();
const verifyCode = '123456';

describe('verify code page', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.task('clearNock');
    cy.mockHousingRegisterApiPostGenerateToken();
  });

  it('shows saving message when user submits their email address before continuing to start page', () => {
    cy.mockHousingRegisterApiPostVerifyToken(applicationId, 1000);
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    //mock the login flow in these tests, so the email is passed in the router query after login as per the usual flow
    cy.loginAsResident(applicationId, true);

    SignInPage.visit();
    SignInPage.getEmailInput().scrollIntoView().type(email);
    SignInPage.getSubmitButton().scrollIntoView().click();

    VerifyPage.getVerifyCodeInput().type(verifyCode);
    VerifyPage.getVerifySubmitButton().scrollIntoView().click();

    cy.contains('Saving...');

    StartPage.getStartApplicationPage().should('be.visible');
  });

  it('shows an error message when confirm verify code API call fails', () => {
    cy.mockHousingRegisterApiPostVerifyToken(
      applicationId,
      0,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);
    cy.loginAsResident(applicationId, true);

    SignInPage.visit();
    SignInPage.getEmailInput().scrollIntoView().type(email);
    SignInPage.getSubmitButton().scrollIntoView().click();

    VerifyPage.getVerifyCodeInput().type(verifyCode);
    VerifyPage.getVerifySubmitButton().scrollIntoView().click();

    cy.contains('Unable to confirm verify code (500)');

    //should not push to the next page
    StartPage.getStartApplicationPage().should('not.exist');
  });

  it('shows an error message when load application API call fails', () => {
    cy.mockHousingRegisterApiPostVerifyToken(applicationId, 0, StatusCodes.OK);
    cy.mockHousingRegisterApiGetApplications(
      applicationId,
      application,
      true,
      0,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    cy.loginAsResident(applicationId, true);

    SignInPage.visit();
    SignInPage.getEmailInput().scrollIntoView().type(email);
    SignInPage.getSubmitButton().scrollIntoView().click();

    VerifyPage.getVerifyCodeInput().type(verifyCode);
    VerifyPage.getVerifySubmitButton().scrollIntoView().click();

    cy.contains('Unable to load application (500)');

    //should not push to the next page
    StartPage.getStartApplicationPage().should('not.exist');
  });
});
