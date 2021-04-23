import { Resident } from "../../domain/resident"
import Collapsible from "../collapsible"

interface SummaryProps {
  heading: string
  applicant: Resident
}

export default function PersonalDetails({ heading, applicant }: SummaryProps): JSX.Element {
  return (
    <Collapsible heading={heading}>
      <dl className="govuk-summary-list lbh-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Name</dt>
          <dd className="govuk-summary-list__value">{applicant.title} {applicant.firstname} {applicant.surname}</dd>
          <dd className="govuk-summary-list__actions">
            <ul className="govuk-summary-list__actions-list">
              <li className="govuk-summary-list__actions-list-item">
                <a className="govuk-link" href="#">
                  Edit<span className="govuk-visually-hidden"> name</span>
                </a>
              </li>
            </ul>
          </dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Date of birth</dt>
          <dd className="govuk-summary-list__value">{applicant.dateOfBirth}</dd>
          <span className="govuk-summary-list__actions"></span>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Address</dt>
          <dd className="govuk-summary-list__value">
            <p className="govuk-body">
              {applicant.address.addressLine1}<br />
              {applicant.address.addressLine2}<br />
              {applicant.address.addressLine3}<br />
              {applicant.address.postCode}
            </p>
          </dd>
          <span className="govuk-summary-list__actions"></span>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Contact information</dt>
          <dd className="govuk-summary-list__value">
            <p className="govuk-body">{applicant.email}</p>
            <p className="govuk-body">{applicant.phoneNumber}</p>
          </dd>
          <span className="govuk-summary-list__actions"></span>
        </div>
      </dl>
    </Collapsible>
  )
}
