import { ReactNode } from 'react';

interface ErrorSummaryProps {
  title?: string;
  children: ReactNode;
}

export default function ErrorSummary({
  title,
  children,
}: ErrorSummaryProps): JSX.Element {
  return (
    <div
      className="govuk-error-summary optional-extra-class lbh-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-module="govuk-error-summary"
    >
      {title && (
        <h2 className="govuk-error-summary__title" id="error-summary-title">
          {title}
        </h2>
      )}
      <div className="govuk-error-summary__body">{children}</div>
    </div>
  );
}
