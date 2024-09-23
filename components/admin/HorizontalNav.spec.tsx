import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../testUtils/test-utils';
import { HorizontalNavItem } from './HorizontalNav';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

// We use msw to intercept the network request during the test,
// and return the response 'John Smith' after 150ms
// when receiving a get request to the `/api/user` endpoint
export const handlers = [
  rest.get(`/api/user`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [{ name: 'John Smith' }],
      })
    );
  }),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe('HorizontalNavItem', () => {
  it('displays the correct button label', () => {
    const expectedLabel = 'New applications';

    renderWithProviders(
      <HorizontalNavItem itemName={'btn-name'} handleSelectNavItem={jest.fn()}>
        {expectedLabel}
      </HorizontalNavItem>
    );

    expect(screen.getByText(expectedLabel)).toBeInTheDocument();
  });
});
