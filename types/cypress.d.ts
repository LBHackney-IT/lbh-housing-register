declare global {
  namespace Cypress {
    interface Chainable {
      generateEmptyApplication(): Chainable<void>;
      mount: typeof mount;
    }
  }
}

export {};
