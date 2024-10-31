import { faker } from '@faker-js/faker/locale/en_GB';

import VerifyPage from '../pages/verify';
import HomePage from '../pages/home';
import SignInPage from '../pages/signIn';
import StartPage from '../pages/start';
import { generateApplication } from '../../testUtils/applicationHelper';

describe('Housing application', () => {
  it(`user successfully verifies and starts application`, () => {
    const generateEmailAddress = faker.internet.email({
      provider: 'hackneyTEST.gov.uk',
    });
    const generateCode = faker.number
      .int({ min: 100000, max: 999999 })
      .toString();
    const applicationId = faker.string.uuid();
    const personId = faker.string.uuid();
    const application = generateApplication(
      applicationId,
      personId,
      false,
      false,
      false
    );

    cy.clearCookies();

    cy.mockHousingRegisterApiPostGenerateToken(0, true);
    cy.mockHousingRegisterApiPostVerifyToken(applicationId);
    cy.mockHousingRegisterApiGetApplications(applicationId, application, true);

    HomePage.visit();
    HomePage.getCookiesButton().click();
    HomePage.getStartApplicationButton().scrollIntoView().click();

    SignInPage.getEmailInput().scrollIntoView().type(generateEmailAddress);
    SignInPage.getSubmitButton().scrollIntoView().click();
    cy.get('button[type="submit"]').click();

    VerifyPage.getVerifyCodePage().should('be.visible');
    VerifyPage.getVerifyCodeInput().scrollIntoView().type(generateCode);

    cy.loginAsResident(applicationId, false, true);
    VerifyPage.getVerifySubmitButton().scrollIntoView().click();

    StartPage.getStartApplicationPage().should('be.visible');
  });
});
