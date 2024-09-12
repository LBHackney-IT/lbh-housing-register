//import { faker } from "@faker-js/faker";

describe('Start your application', () => {
  it("doesn't lose person object from the application", () => {
    //const email = faker.internet.email();

    cy.clearCookies();
    cy.loginAsResident('dummy');
  });
});
