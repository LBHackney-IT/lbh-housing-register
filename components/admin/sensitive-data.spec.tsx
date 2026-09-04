import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import SensitiveData from './sensitive-data';
import { updateApplication } from '../../lib/gateways/internal-api';
import { UserFacingError } from '../../lib/utils/errorHelper';
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
const user = generateHRUserWithPermissions(UserRole.Manager);

describe('SensitiveData', () => {
  beforeEach(() => {
    updateApplicationMock.mockReset();
    mockReload.mockReset();
  });

  it('reloads after a successful update', async () => {
    updateApplicationMock.mockResolvedValue({});

    render(<SensitiveData id="app-1" isSensitive={false} user={user} />);
    fireEvent.click(screen.getByTestId('test-sensitive-data-button'));

    await waitFor(() => expect(mockReload).toHaveBeenCalled());
  });

  it('shows an error and re-enables the button when the update fails', async () => {
    updateApplicationMock.mockRejectedValue(
      new UserFacingError('Unable to update application (500)'),
    );

    render(<SensitiveData id="app-1" isSensitive={false} user={user} />);
    fireEvent.click(screen.getByTestId('test-sensitive-data-button'));

    await waitFor(() => {
      expect(
        screen.getByText('Unable to update application (500)'),
      ).toBeInTheDocument();
    });
    expect(mockReload).not.toHaveBeenCalled();
    expect(screen.getByTestId('test-sensitive-data-button')).toBeEnabled();
  });
});
