import { AddressApiResponse } from './locale2eTestsHelper';

/** Minimal shape returned by `POST /api/applications/:id/evidence` for the resident thunk. */
const localE2eEvidenceResponseBody = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Stubs the Next BFF evidence endpoint from the browser. Use for `LOCAL_E2E` when the
 * Housing Register API has no Evidence service (e.g. localstack) — no `E2E_HTTP_MOCKS` required.
 */
export const interceptLocalE2eApplicationEvidencePost = () => {
  cy.intercept('POST', '**/api/applications/*/evidence', {
    statusCode: 200,
    body: localE2eEvidenceResponseBody,
  });
};

export const interceptAddressSearchAPI = (response: AddressApiResponse) => {
  cy.intercept(
    {
      method: 'GET',
      path: '/api/address/*',
    },
    response,
  ).as('addressSearchMock');
};
