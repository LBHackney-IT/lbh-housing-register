import { Resident } from "../../domain/resident"
import Collapsible from "../collapsible"

interface SummaryProps {
  heading: string
  others: Array<Resident>
}

export default function OtherMembers({ heading, others }: SummaryProps): JSX.Element {
  return (
    <Collapsible heading={heading}>
      <dl className="govuk-summary-list lbh-summary-list">
        {others.map((applicant, index) => (
          <div key={index} className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">{applicant.person.id}</dt>
            <dd className="govuk-summary-list__value">
              <a className="govuk-link" href="#">
                {applicant.person.title} {applicant.person.firstName} {applicant.person.surname}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </Collapsible>
  )
}
