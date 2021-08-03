import Link from 'next/link';
import { ApplicantWithPersonID, getQuestionValue } from "../../lib/store/applicant";
import { formatDate } from '../../lib/utils/addressHistory';
import { FormID } from '../../lib/utils/form-data';

interface PersonalDetailsSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export default function PersonalDetailsSummary({
  currentResident,
}: PersonalDetailsSummaryProps): JSX.Element {

  return (
    <div>
      <dl className="govuk-summary-list lbh-summary-list">
        <h3 className="lbh-heading-h3">Personal Details</h3>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Name</dt>
          <dd className="govuk-summary-list__value">
            {`${currentResident.person.firstName} ${currentResident.person.surname}`}
          </dd>
          <dd className="govuk-summary-list__actions">
            <Link
              href={{
                pathname: '/apply/[resident]/personal-details',
                query: { resident: currentResident.person.id },
              }}
            >
              <a>Edit</a>
            </Link>
          </dd>
        </div>
        {currentResident.person.dateOfBirth && (
          <div className="govuk-summary-list__row">
            <dt className="govuk-summary-list__key">Date of birth</dt>
            <dd className="govuk-summary-list__value">
              {formatDate(new Date(currentResident.person.dateOfBirth))}
            </dd>
            <dd className="govuk-summary-list__actions"></dd>
          </div>
        )}
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Gender</dt>
          <dd className="govuk-summary-list__value">
            {currentResident.person?.gender}
          </dd>
          <dd className="govuk-summary-list__actions"></dd>
        </div>
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">NI Number</dt>
          <dd className="govuk-summary-list__value">
            {getQuestionValue(
              currentResident.questions,
              FormID.PERSONAL_DETAILS,
              'nationalInsuranceNumber'
            )}
          </dd>
          <dd className="govuk-summary-list__actions"></dd>
        </div>
      </dl>
    </div>
  )
}


