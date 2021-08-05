import React from 'react';
import { ApplicantWithPersonID, getQuestionValue } from "../../lib/store/applicant";
import { formatDate } from '../../lib/utils/addressHistory';
import { FormID } from '../../lib/utils/form-data';
import { getGenderName } from '../../lib/utils/gender';
import { SummarySection, SummaryTitle } from './SummaryInfo';

interface PersonalDetailsSummaryProps {
  currentResident: ApplicantWithPersonID;
}

export default function PersonalDetailsSummary({
  currentResident,
}: PersonalDetailsSummaryProps): JSX.Element {

  return (
    <SummarySection>
      <SummaryTitle
        content="Personal Details"
        href={`/apply/${currentResident.person.id}/${FormID.PERSONAL_DETAILS}`} />

      <dl className="govuk-summary-list lbh-summary-list">
        <div className="govuk-summary-list__row">
          <dt className="govuk-summary-list__key">Name</dt>
          <dd className="govuk-summary-list__value">
            {`${currentResident.person.firstName} ${currentResident.person.surname}`}
          </dd>
          <dd className="govuk-summary-list__actions"></dd>
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
            {getGenderName(currentResident)}
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
    </SummarySection>
  )
}


