import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';

import MainApplicantForm from './MainApplicantForm';
import { type Address } from '../../lib/utils/adminHelpers';
import {
  generateHRUserWithPermissions,
  UserRole,
} from '../../testUtils/userHelper';

jest.mock('components/loading', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));

jest.mock('../layout/staff-layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('./AddCaseSection', () => {
  const { Field } = jest.requireActual<typeof import('formik')>('formik');

  return {
    __esModule: true,
    default: function MockAddCaseSection() {
      return (
        <div>
          <label htmlFor="personalDetails_gender">Gender</label>
          <Field
            id="personalDetails_gender"
            name="personalDetails_gender"
            as="select"
          >
            <option value="">Select an option</option>
            <option value="female">Female</option>
          </Field>
        </div>
      );
    },
  };
});

jest.mock('./AddCaseEthnicity', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./AddCaseAddress', () => ({
  __esModule: true,
  default: ({ error }: { error?: string }) => (
    <div data-testid="address-validation-error">{error ?? ''}</div>
  ),
}));

jest.mock('lbh-frontend/dialog', () => ({
  __esModule: true,
  default: () => null,
}));

const user = generateHRUserWithPermissions(UserRole.Manager);

const sampleAddress: Address = {
  address: {
    line1: '18 Pitchford Street',
    line2: '',
    town: 'London',
    county: '',
    postcode: 'E154RX',
  },
  date: '2020-01-01T00:00:00.000Z',
  dateTo: '2024-01-01T00:00:00.000Z',
};

function MainApplicantFormHarness({
  initialAddresses = [] as Address[],
}: {
  initialAddresses?: Address[];
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [addressHistory, setAddressHistory] =
    useState<Address[]>(initialAddresses);

  return (
    <>
      <button type="button" onClick={() => setAddressHistory([sampleAddress])}>
        Add sample address
      </button>
      <MainApplicantForm
        isEditing={false}
        user={user}
        onSubmit={jest.fn()}
        isSubmitted={isSubmitted}
        addressHistory={addressHistory}
        setAddressHistory={setAddressHistory}
        handleSaveApplication={() => setIsSubmitted(true)}
        ethnicity=""
        setEthnicity={jest.fn()}
        dataTestId="test-main-applicant-form"
      />
    </>
  );
}

describe('MainApplicantForm address validation', () => {
  it('shows an address error after submit when address history is empty', async () => {
    render(<MainApplicantFormHarness />);

    fireEvent.change(screen.getByLabelText('Gender'), {
      target: { value: 'female' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Save new application' }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('address-validation-error')).toHaveTextContent(
        'Address is a required field',
      );
    });

    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /address is a required field/i }),
    ).toHaveAttribute('href', '#addressHistory');
  });

  it('clears the address error when an address is added after a failed submit', async () => {
    render(<MainApplicantFormHarness />);

    fireEvent.change(screen.getByLabelText('Gender'), {
      target: { value: 'female' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Save new application' }),
    );

    await waitFor(() => {
      expect(screen.getByTestId('address-validation-error')).toHaveTextContent(
        'Address is a required field',
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'Add sample address' }));

    await waitFor(() => {
      expect(screen.getByTestId('address-validation-error')).toHaveTextContent(
        '',
      );
    });
  });
});
