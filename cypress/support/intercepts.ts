import { AddressApiResponse } from './locale2eTestsHelper';

export const interceptAddressSearchAPI = (response: AddressApiResponse) => {
  cy.intercept(
    {
      method: 'GET',
      path: '/api/address/*',
    },
    response
  ).as('addressSearchMock');
};
