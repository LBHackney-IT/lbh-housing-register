import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormikValues } from 'formik';

import { updateApplication } from '../../../lib/gateways/internal-api';
import { UserFacingError } from '../../../lib/utils/errorHelper';
import { scrollToTop } from '../../../lib/utils/scroll';
import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../../testUtils/userHelper';
import EditApplicant from '../../../pages/applications/edit/[id]/[person]/index';

const mockPush = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('../../../lib/utils/scroll', () => ({
  scrollToTop: jest.fn(),
}));

jest.mock('../../../lib/utils/adminHelpers', () => ({
  generateQuestionArray: jest.fn(() => []),
  convertAddressToPrimary: jest.fn(() => ({})),
}));

jest.mock('../../../lib/gateways/applications-api', () => ({
  getApplication: jest.fn(),
}));

jest.mock('../../../lib/gateways/internal-api', () => ({
  updateApplication: jest.fn(),
}));

jest.mock('../../../components/admin/MainApplicantForm', () => ({
  __esModule: true,
  default: ({
    onSubmit,
    userError,
  }: {
    onSubmit: (values: FormikValues) => void | Promise<void>;
    userError?: string;
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
            personalDetails_genderDescription: '',
            personalDetails_nationalInsuranceNumber: '',
            personalDetails_emailAddress: 'ada@example.com',
            personalDetails_phoneNumber: '',
          })
        }
      >
        Update application
      </button>
      <div data-testid="user-error">{userError}</div>
    </div>
  ),
}));

const user = generateHRUserWithPermissions(UserRole.Manager);
const updateApplicationMock = updateApplication as jest.Mock;

describe('EditApplicant', () => {
  beforeEach(() => {
    mockPush.mockReset();
    updateApplicationMock.mockReset();
  });

  it('scrolls to the top when the update fails', async () => {
    updateApplicationMock.mockRejectedValue(
      new UserFacingError('Unable to update'),
    );

    render(
      <EditApplicant
        user={user}
        data={{ id: 'app-1', mainApplicant: { questions: [] } }}
        person="person-1"
        evidenceLink=""
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Update application' }));

    await waitFor(() => {
      expect(screen.getByTestId('user-error')).toHaveTextContent(
        'Unable to update',
      );
    });
    expect(scrollToTop).toHaveBeenCalled();
  });
});
