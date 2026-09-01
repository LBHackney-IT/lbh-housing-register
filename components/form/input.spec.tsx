import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';

import Input from './input';

function renderInput({
  error,
  initialErrors = {},
  initialTouched = {},
}: {
  error?: string;
  initialErrors?: Record<string, string>;
  initialTouched?: Record<string, boolean>;
} = {}) {
  return render(
    <Formik
      initialValues={{ email: '' }}
      initialErrors={initialErrors}
      initialTouched={initialTouched}
      onSubmit={jest.fn()}
    >
      <Input name="email" error={error} />
    </Formik>,
  );
}

describe('Input submit errors', () => {
  it('shows an external error on the field', () => {
    renderInput({
      error: 'An application already exists for this email address.',
    });

    expect(
      screen.getByText('An application already exists for this email address.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('test-input-email')).toHaveClass(
      'govuk-input--error',
    );
  });

  it('shows a Formik validation error when the field has not been touched', () => {
    renderInput({
      initialErrors: { email: 'Enter an email address' },
      initialTouched: { email: true },
    });

    expect(screen.getByText('Enter an email address')).toBeInTheDocument();
  });

  it('does not show a Formik validation error when the field has been touched', () => {
    renderInput({
      initialErrors: { email: 'Enter an email address' },
      initialTouched: { email: false },
    });

    expect(
      screen.queryByText('Enter an email address'),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('test-input-email')).not.toHaveClass(
      'govuk-input--error',
    );
  });
});
