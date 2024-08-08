// This is here because of a know issue with cypress and jest types
// https://docs.cypress.io/guides/component-testing/faq#How-do-I-get-TypeScript-to-recognize-Cypress-types-and-not-Jest-types
/// <reference types="cypress" />

class HomePage {
  static visit() {
    cy.visit('/');
  }

  static getStartApplicationButton() {
    const testId = 'test-start-application-button';
    return cy.get(`[data-testid="${testId}"]`);
  }
}
export default HomePage
