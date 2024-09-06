export const interceptAuthApi = (interceptPath) => {
  cy.intercept('POST', `**/api/auth/${interceptPath}**`, {
    statusCode: 200,
    body: {
      success: true,
    },
  }).as(`intercept_${interceptPath}`);
};

export const interceptApplicatonApi = () => {
  cy.generateEmptyApplication();
  cy.fixture('application.json').then((application) => {
    cy.intercept('GET', `**/api/applications**`, {
      statusCode: 200,
      body: application,
    }).as(`intercept_application_api`);
  });
};
