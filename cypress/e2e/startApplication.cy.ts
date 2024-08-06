import HomePage from '../pages/home';

describe('Housing Register', () => {
  beforeEach(() => {
    HomePage.visit();
  });
  it('user can start or resume an applicaton', () => {
    HomePage.getStartApplicationButton().click();
  });
});
