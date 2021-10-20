import { ReactNodeArray } from 'react';

interface FormGroupProps {
  children: ReactNodeArray;
  error?: any;
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
