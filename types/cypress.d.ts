declare global {
  namespace Cypress {
    interface Chainable {
      generateEmptyApplication(): Chainable<void>;
      loginAsUser(userType: string): Chainable<void>;
      mount: typeof mount;
    }
  }
}

export {};
