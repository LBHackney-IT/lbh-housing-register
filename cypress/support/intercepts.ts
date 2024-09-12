export const interceptAuthApi = (interceptPath) => {
  cy.intercept('POST', `**/api/auth/${interceptPath}**`, {
    statusCode: 200,
    body: {
      success: true,
    },
  }).as(`intercept_${interceptPath}`);
};

export const interceptAuthApiGenerate = () => {
  cy.intercept('POST', `**/api/auth/generate**`, {
    statusCode: 200,
    body: {
      success: true,
    },
  }).as(`intercept_auth_api_generate}`);
};

export const interceptAuthApiVerify = () => {
  cy.intercept('POST', `**/api/auth/verify**`, {
    statusCode: 200,
    body: {
      AccessToken: '123456',
    },
  }).as(`intercept_auth_api_generate}`);
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

export const interceptApplicationApiPatch = () => {
  cy.intercept('PATCH', `**/api/applications**`, {
    statusCode: 200,
    body: {},
  }).as(`intercept_application_api_patch`);
};
