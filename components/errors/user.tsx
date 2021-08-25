import { ReactNode } from 'react';

interface UserErrors {
  children: ReactNode;
}

export default function UserErrors({ children }: UserErrors): JSX.Element {
  return (
    <div
      className="govuk-error-summary optional-extra-class lbh-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-module="govuk-error-summary"
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title">
        {children}
      </h2>
    </div>
  );
}
