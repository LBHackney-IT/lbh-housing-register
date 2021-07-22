interface DetailsProps {
  summary: string;
  children: string | JSX.Element;
}

export default function Details({ summary, children }: DetailsProps): JSX.Element {
  return (
    <div>
      <details className="govuk-details lbh-details" data-module="govuk-details">
        <summary className="govuk-details__summary">
          <span className="govuk-details__summary-text">{summary}</span>
        </summary>
        <div className="govuk-details__text">
          {children}
        </div>
      </details>
    </div>
  );
}
