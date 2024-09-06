declare global {
  namespace Cypress {
    interface Chainable {
      generateEmptyApplication(): Chainable<void>;
      loginAsUser(userType: string): Chainable<void>;
      mockActivityHistoryApiEmptyResponse(targetId: string): Chainable<void>;
      mockHousingRegisterApiPostSearchResults(
        application: Application
      ): Chainable<void>;
      mockHousingRegisterApiGetApplications(
        applicationId: string,
        application: Application
      ): Chainable<void>;
      mount: typeof mount;
    }
  }
}

export {};
