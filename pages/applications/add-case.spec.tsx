import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormikValues } from 'formik';
import { type ReactNode } from 'react';

import {
  CreateApplicationError,
  completeApplication,
  createApplication,
  updateApplication,
} from '../../lib/gateways/internal-api';
import { scrollToTop } from '../../lib/utils/scroll';
import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../testUtils/userHelper';
import AddCasePage from './add-case';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('../../lib/utils/scroll', () => ({
  scrollToTop: jest.fn(),
}));

jest.mock('../../lib/utils/adminHelpers', () => ({
  generateQuestionArray: jest.fn(() => []),
  convertAddressToPrimary: jest.fn(() => ({})),
}));

jest.mock('../../lib/gateways/internal-api', () => {
  const actual = jest.requireActual('../../lib/gateways/internal-api');
  return {
    ...actual,
    createApplication: jest.fn(),
    completeApplication: jest.fn(),
    updateApplication: jest.fn(),
  };
});

jest.mock('../../components/admin/MainApplicantForm', () => ({
  __esModule: true,
  default: ({
    onSubmit,
    userError,
    fieldErrors,
  }: {
    onSubmit: (values: FormikValues) => void | Promise<void>;
    userError?: ReactNode;
    fieldErrors?: Record<string, string | undefined>;
  }) => (
    <div>
      <button
        type="button"
        onClick={() =>
          onSubmit({
            personalDetails_title: 'Mr',
            personalDetails_firstName: 'Ada',
            personalDetails_surname: 'Lovelace',
            personalDetails_dateOfBirth: '1815-12-10',
            personalDetails_gender: 'female',
            personalDetails_nationalInsuranceNumber: '',
            personalDetails_emailAddress: 'ada@example.com',
            personalDetails_phoneNumber: '',
          })
        }
      >
        Save new application
      </button>
      <div data-testid="user-error">{userError}</div>
      <div data-testid="email-error">
        {fieldErrors?.personalDetails_emailAddress ?? ''}
      </div>
    </div>
  ),
}));

const user = generateHRUserWithPermissions(UserRole.Manager);
const createApplicationMock = createApplication as jest.Mock;
const completeApplicationMock = completeApplication as jest.Mock;
const updateApplicationMock = updateApplication as jest.Mock;

const formValuesSubmit = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Save new application' }));

describe('AddCasePage', () => {
  beforeEach(() => {
    mockPush.mockReset();
    createApplicationMock.mockReset();
    completeApplicationMock.mockReset();
    updateApplicationMock.mockReset();
  });

  it('redirects after a successful create', async () => {
    createApplicationMock.mockResolvedValue({ id: 'new-id' });
    completeApplicationMock.mockResolvedValue({ id: 'new-id' });
    updateApplicationMock.mockResolvedValue({ id: 'new-id' });

    render(<AddCasePage user={user} />);
    formValuesSubmit();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/applications/view/new-id');
    });
  });

  it('shows a duplicate-email error with a link to the existing case', async () => {
    createApplicationMock.mockRejectedValue(
      new CreateApplicationError(
        'An application already exists for this email address.',
        409,
        ['existing-id'],
      ),
    );

    render(<AddCasePage user={user} />);
    formValuesSubmit();

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent(
        'An application already exists for this email address. Enter a different email address, or leave it blank.',
      );
    });

    const existingCaseLink = screen.getByRole('link', {
      name: 'View existing case',
    });
    expect(existingCaseLink).toHaveAttribute(
      'href',
      '/applications/view/existing-id',
    );
    expect(existingCaseLink).toHaveAttribute('target', '_blank');
    expect(scrollToTop).toHaveBeenCalled();
  });

  it('links to each existing case when more than one matches the email', async () => {
    createApplicationMock.mockRejectedValue(
      new CreateApplicationError(
        'Applications already exist for this email address.',
        409,
        ['id-1', 'id-2'],
      ),
    );

    render(<AddCasePage user={user} />);
    formValuesSubmit();

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'View case 1' })).toHaveAttribute(
        'href',
        '/applications/view/id-1',
      );
    });
    expect(screen.getByRole('link', { name: 'View case 2' })).toHaveAttribute(
      'href',
      '/applications/view/id-2',
    );
  });

  it('shows the thrown message for other errors', async () => {
    createApplicationMock.mockRejectedValue(new Error('Network down'));

    render(<AddCasePage user={user} />);
    formValuesSubmit();

    await waitFor(() => {
      expect(screen.getByTestId('user-error')).toHaveTextContent(
        'Network down',
      );
    });
  });

  it('shows a generic message when the failure is not an Error', async () => {
    createApplicationMock.mockRejectedValue('nope');

    render(<AddCasePage user={user} />);
    formValuesSubmit();

    await waitFor(() => {
      expect(screen.getByTestId('user-error')).toHaveTextContent(
        'Unable to create application',
      );
    });
  });
});
