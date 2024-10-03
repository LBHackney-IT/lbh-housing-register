import SignInPage from '../../pages/signIn';
import VerifyPage from '../../pages/verify';
import { generateEmailAddress } from '../../../testUtils/personHelper';
import { StatusCodes } from 'http-status-codes';

const email = generateEmailAddress();

describe('Sign in page, user not logged in', () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.task('clearNock');
  });

  it('shows saving message before navigating to verify page when user submits their email address', () => {
    cy.mockHousingRegisterApiPostGenerateToken(1000);

    SignInPage.visit();
    SignInPage.getEmailInput().scrollIntoView().type(email);
    SignInPage.getSubmitButton().scrollIntoView().click();

    cy.contains('Saving...');
    VerifyPage.getVerifyCodePage().should('be.visible');
  });

  it('shows error message when create verify code API call fails', () => {
    cy.mockHousingRegisterApiPostGenerateToken(
      0,
      false,
      StatusCodes.BAD_REQUEST
    );

    SignInPage.visit();
    SignInPage.getEmailInput().scrollIntoView().type(email);
    SignInPage.getSubmitButton().scrollIntoView().click();

    //currently the API layer returns 500 regardless of the HR API response status
    cy.contains('Unable to create verify code (500)');
  });
});
