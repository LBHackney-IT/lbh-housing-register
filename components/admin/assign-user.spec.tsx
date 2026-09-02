import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import AssignUser from './assign-user';
import { APPLICATION_UNNASIGNED } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../testUtils/userHelper';

const mockReload = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ reload: mockReload }),
}));

jest.mock('../../lib/gateways/internal-api', () => ({
  updateApplication: jest.fn(),
}));

const updateApplicationMock = updateApplication as jest.Mock;
const user = generateHRUserWithPermissions(UserRole.Officer);

describe('AssignUser', () => {
  beforeEach(() => {
    updateApplicationMock.mockReset();
    mockReload.mockReset();
  });

  it('reloads after a successful assignment', async () => {
    updateApplicationMock.mockResolvedValue({});

    render(
      <AssignUser id="app-1" user={user} assignee={APPLICATION_UNNASIGNED} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'assign to me' }));

    await waitFor(() => expect(mockReload).toHaveBeenCalled());
  });

  it('shows an error and re-enables controls when assignment fails', async () => {
    updateApplicationMock.mockRejectedValue(
      new Error('Unable to update application (403)'),
    );

    render(
      <AssignUser id="app-1" user={user} assignee={APPLICATION_UNNASIGNED} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'assign to me' }));

    await waitFor(() => {
      expect(
        screen.getByText('Unable to update application (403)'),
      ).toBeInTheDocument();
    });
    expect(mockReload).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'assign to me' })).toBeEnabled();
  });
});
