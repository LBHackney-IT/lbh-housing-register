import { Applicant } from '../../domain/HousingApi';
import { ButtonLink } from '../button';
import { formatDob, getAgeInYears } from '../../lib/utils/dateOfBirth';
import React from 'react';
import { HeadingThree } from '../content/headings';
import { getGenderName } from '../../lib/utils/gender';
import Hint from '../form/hint';

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
    <>
      <HeadingThree content={heading} />
      <table className="govuk-table lbh-table" style={{ marginTop: '1em' }}>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            <th scope="col" colSpan={2} className="govuk-table__header">
              <Hint content="Person details" />
            </th>
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {others.map((applicant, index) => (
            <tr className="govuk-table__row">
              <td className="govuk-table__cell">
                <strong>
                  {applicant.person?.title} {applicant.person?.firstName}{' '}
                  {applicant.person?.surname}
                </strong>
                {applicant.person?.relationshipType && (
                  <>
                    <br />
                    {applicant.person?.relationshipType}
                  </>
                )}
                <br />
                {getGenderName(applicant)},{' '}
                {applicant.person?.dateOfBirth &&
                  formatDob(new Date(applicant.person?.dateOfBirth))}{' '}
                {applicant.person?.dateOfBirth &&
                  `(age ${getAgeInYears(applicant)})`}
              </td>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                <ButtonLink
                  href={`/applications/view/${applicationId}/${applicant.person?.id}`}
                >
                  Open
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
