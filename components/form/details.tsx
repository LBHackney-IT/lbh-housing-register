export default function Details(): JSX.Element {
  return (
   <div>
    <details className="govuk-details lbh-details" data-module="govuk-details">
    <summary className="govuk-details__summary">
      <span className="govuk-details__summary-text"> Help with home address </span>
    </summary>
    <div className="govuk-details__text">
      If you have no fixed abode or if you are sofa surfing, use the address where you
      sleep for the majority of the week. If you are living on the street, contact a housing
      officer.
    </div>
    </details>
  </div>
  );
}
