import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import router from 'next/router';

import Actions from './actions';
import { Application } from '../../domain/HousingApi';
import { updateApplication } from '../../lib/gateways/internal-api';
import { ApplicationStatus } from '../../lib/types/application-status';
import { UserFacingError } from '../../lib/utils/errorHelper';

jest.mock('next/router', () => ({
  __esModule: true,
  default: {
    replace: jest.fn().mockResolvedValue(true),
    asPath: '/applications/view/app-1?tab=assessment',
  },
}));

jest.mock('../../lib/gateways/internal-api', () => ({
  updateApplication: jest.fn(),
}));

const updateApplicationMock = updateApplication as jest.Mock;

const application: Application = {
  id: 'app-1',
  status: ApplicationStatus.ACTIVE,
  calculatedBedroomNeed: 2,
  assessment: { band: 'B', biddingNumber: '1234567' },
  mainApplicant: { questions: [] },
  otherMembers: [],
};

const submit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

describe('Actions assessment form', () => {
  beforeEach(() => {
    updateApplicationMock.mockReset();
    (router.replace as jest.Mock).mockReset().mockResolvedValue(true);
  });

  it('re-runs getServerSideProps on the current tab after a successful save', async () => {
    updateApplicationMock.mockResolvedValue({});

    render(<Actions data={application} />);
    submit();

    await waitFor(() =>
      expect(router.replace).toHaveBeenCalledWith(
        '/applications/view/app-1?tab=assessment',
      ),
    );
  });

  it('clears the saving spinner once the save and refetch settle', async () => {
    updateApplicationMock.mockResolvedValue({});

    render(<Actions data={application} />);
    submit();

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Save changes' }),
      ).toBeEnabled(),
    );
    expect(
      screen.queryByText('Updating assessment status…'),
    ).not.toBeInTheDocument();
  });

  it('shows the API message when the update is rejected', async () => {
    updateApplicationMock.mockRejectedValue(
      new UserFacingError(
        'Supplied bidding number "1234567" is reserved for auto-generation.',
      ),
    );

    render(<Actions data={application} />);
    submit();

    await waitFor(() => {
      expect(
        screen.getByText(
          'Supplied bidding number "1234567" is reserved for auto-generation.',
        ),
      ).toBeInTheDocument();
    });
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
  });

  it('logs a dropped connection and shows a fallback message instead', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const networkError = new TypeError('Failed to fetch');
    updateApplicationMock.mockRejectedValue(networkError);

    render(<Actions data={application} />);
    submit();

    await waitFor(() => {
      expect(
        screen.getByText('Unable to update assessment'),
      ).toBeInTheDocument();
    });
    expect(screen.queryByText('Failed to fetch')).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(
      'Unable to update assessment',
      networkError,
    );
    consoleError.mockRestore();
  });

  it('re-enables the form after a failed update', async () => {
    updateApplicationMock.mockRejectedValue(new UserFacingError('Bad request'));

    render(<Actions data={application} />);
    submit();

    await waitFor(() => {
      expect(screen.getByText('Bad request')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeEnabled();
  });
});
