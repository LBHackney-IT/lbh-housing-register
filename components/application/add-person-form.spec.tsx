import { render, screen } from '@testing-library/react';

import AddPersonForm from './add-person-form';
import { Applicant } from '../../domain/HousingApi';

function renderForm({
  applicant,
  isMainApplicant = true,
}: {
  applicant: Applicant;
  isMainApplicant?: boolean;
}) {
  render(
    <AddPersonForm
      applicant={applicant}
      onSubmit={jest.fn()}
      isMainApplicant={isMainApplicant}
      buttonText="Continue"
      isOver16={true}
      setIsOver16State={jest.fn()}
    />,
  );
}

describe('AddPersonForm email', () => {
  it('shows the stored main applicant email as read-only with a sign-in hint', () => {
    renderForm({
      applicant: {
        contactInformation: { emailAddress: 'ada@example.com' },
      } as Applicant,
    });

    const email = screen.getByLabelText('Email');
    expect(email).toHaveValue('ada@example.com');
    expect(email).toHaveAttribute('readonly');
    expect(
      screen.getByText(
        'You use this email address to sign in, so it cannot be changed.',
      ),
    ).toBeInTheDocument();
  });

  it('keeps the email editable when the main applicant has no stored email yet', () => {
    renderForm({
      applicant: {
        contactInformation: { emailAddress: '' },
      } as Applicant,
    });

    const email = screen.getByLabelText('Email');
    expect(email).not.toHaveAttribute('readonly');
    expect(
      screen.queryByText(
        'You use this email address to sign in, so it cannot be changed.',
      ),
    ).not.toBeInTheDocument();
  });

  it('does not show an email field for other household members', () => {
    renderForm({
      applicant: {
        contactInformation: { emailAddress: 'ada@example.com' },
      } as Applicant,
      isMainApplicant: false,
    });

    expect(screen.queryByLabelText('Email')).not.toBeInTheDocument();
  });
});
