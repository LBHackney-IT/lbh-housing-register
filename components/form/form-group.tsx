import type { ReactNode } from 'react';

interface FormGroupProps {
  children: ReactNode;
  error?: unknown;
}

export default function FormGroup({
  children,
  error,
}: FormGroupProps): JSX.Element {
  return (
    <div
      className={`govuk-form-group lbh-form-group${
        error ? ' govuk-form-group--error' : ''
      }`}
    >
      {children}
    </div>
  );
}
