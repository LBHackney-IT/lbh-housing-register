import { ContactInformation } from "../../domain/resident"
import Collapsible from "../collapsible"

interface SummaryProps {
  heading: string
  contact: ContactInformation
}

export default function ContactDetails({ heading, contact }: SummaryProps): JSX.Element {
  return (
    <Collapsible heading={heading}>
      <dl className="govuk-summary-list lbh-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Email Address</dt>
          <dd className="govuk-summary-list__value">{contact.emailAddress}</dd>
          <span className="govuk-summary-list__actions"></span>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Phone Number</dt>
          <dd className="govuk-summary-list__value">{contact.phoneNumber} </dd>
          <span className="govuk-summary-list__actions"></span>
        </div>
      </dl>
    </Collapsible>
  )
}
