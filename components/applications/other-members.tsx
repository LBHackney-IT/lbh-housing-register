import { Applicant } from '../../domain/HousingApi';
import Collapsible from '../collapsible';

interface SummaryProps {
  heading: string;
  others: Applicant[];
  applicationId: string;
}

export default function OtherMembers({
  heading,
  others,
  applicationId,
}: SummaryProps): JSX.Element {
  return (
    <Collapsible heading={heading}>
      <dl className="govuk-summary-list lbh-summary-list">
        {others.map((applicant, index) => (
          <div key={index} className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Person {index + 1}</dt>
            <dd className="govuk-summary-list__value">
              {applicant.person?.title} {applicant.person?.firstName} {applicant.person?.surname}
            </dd>
            <dd className="govuk-summary-list__actions">
              <ul className="govuk-summary-list__actions-list">
                <li className="govuk-summary-list__actions-list-item">
                  <a className="govuk-link" href={`/applications/${applicationId}/${applicant.person?.id}`}>
                    Review<span className="govuk-visually-hidden"> {applicant.person?.firstName}</span>
                  </a>
                </li>
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Collapsible>
  );
}
