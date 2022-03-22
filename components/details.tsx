import { ReactNode } from 'react';

interface DetailsProps {
  summary: string;
  children: ReactNode;
  open?: boolean;
}

export default function Details({
  summary,
  children,
  open = false,
}: DetailsProps): JSX.Element {
  return (
    <div>
      <details
        className="govuk-details lbh-details"
        data-module="govuk-details"
        open={open}
      >
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">{summary}</span>
        </summary>
        <div className="govuk-details__text">{children}</div>
      </details>
    </div>
  );
}
