import { Applicant } from '../../domain/HousingApi';
import { ButtonLink } from '../button';
import { formatDob, getAgeInYears } from '../../lib/utils/dateOfBirth';
import React from 'react';
import { HeadingThree } from '../content/headings';
import { getGenderName } from '../../lib/utils/gender';

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
        <tbody className="govuk-table__body">
          {others.map((applicant, index) => (
            <tr key={index} className="govuk-table__row">
              <td className="govuk-table__cell">
                <ul className="lbh-list lbh-list--compressed">
                  <li>
                    <strong>
                      {applicant.person?.title} {applicant.person?.firstName}{' '}
                      {applicant.person?.surname}
                    </strong>
                  </li>
                  <li>
                    {applicant.person?.relationshipType &&
                      applicant.person?.relationshipType}
                  </li>
                  <li>
                    {getGenderName(applicant)},{' '}
                    {applicant.person?.dateOfBirth &&
                      formatDob(new Date(applicant.person?.dateOfBirth))}{' '}
                    {applicant.person?.dateOfBirth &&
                      `(age ${getAgeInYears(applicant)})`}
                  </li>
                </ul>
              </td>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                <ButtonLink
                  additionalCssClasses="lbh-!-margin-top-0 govuk-secondary lbh-button--secondary"
                  href={`/applications/edit/${applicationId}/${applicant.person?.id}`}
                >
                  Edit
                </ButtonLink>
                <ButtonLink
                  additionalCssClasses="lbh-!-margin-top-0 lbh-!-margin-left-1"
                  href={`/applications/view/${applicationId}/${applicant.person?.id}`}
                >
                  View
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
