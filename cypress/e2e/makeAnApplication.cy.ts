import { faker } from '@faker-js/faker/locale/en_GB';

import { generateApplication } from '../../testUtils/applicationHelper';
import ApplyPage from '../pages/apply';
import HomePage from '../pages/home';
import SignInPage from '../pages/signIn';
import StartPage from '../pages/start';
import { interceptApplicationApiPatch } from '../support/intercepts';

describe('Housing application', () => {
  it(`user successfully verifies and starts application`, () => {
    const generateEmailAddress = faker.internet.email({
      provider: 'hackneyTEST.gov.uk',
    });
    const generateCode = faker.number
      .int({ min: 100000, max: 999999 })
      .toString();

    cy.clearCookies();

    const applicationId = faker.string.uuid();
    const personId = faker.string.uuid();
    const application = generateApplication(applicationId, personId);

    cy.mockHousingRegisterApiPostApplications(application);
    cy.mockHousingRegisterApiGetApplications(applicationId, application);
    cy.mockHousingRegisterApiGenerate();
    cy.mockHousingRegisterApiVerify();

    HomePage.visit();
    HomePage.getCookiesButton().click();
    HomePage.getStartApplicationButton().scrollIntoView().click();
    SignInPage.getEmailInput()
      .scrollIntoView()
      .type(generateEmailAddress, { delay: 0 });

    SignInPage.getSubmitButton().scrollIntoView().click();
    cy.get('button[type="submit"]').click();
    ApplyPage.getVerifyCodePage().should('be.visible');
    ApplyPage.getVerifyCodeInput()
      .scrollIntoView()
      .type(generateCode, { delay: 0 });
    ApplyPage.getVerifySubmitButton().scrollIntoView().click();

    StartPage.getStartApplicationPage().should('be.visible');

    interceptApplicationApiPatch();

    cy.get('select').select('Mr');

    cy.get('#firstName').type('First', { delay: 0 });
    cy.get('#surname').type('Last', { delay: 0 });

    cy.get('#dateOfBirth-day').type('01', { delay: 0 });
    cy.get('#dateOfBirth-month').type('01', { delay: 0 });
    cy.get('#dateOfBirth-year').type('1940', { delay: 0 });

    cy.get('#nationalInsuranceNumber').type('abcdefghijklmn', { delay: 0 });
    cy.get('#phoneNumber').type('079 5555 5555', { delay: 0 });

    cy.get('button[type="submit"]').click();

    //page chnages
    cy.contains('Confidentiality and data protection');

    cy.get('[type="checkbox"]').check();
    cy.get('button[type="submit"]').click();

    //page change
    cy.contains('Who are you applying with?');
    cy.get('button[type="submit"]').click();
  });
});
