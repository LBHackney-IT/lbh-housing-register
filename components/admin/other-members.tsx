import { Applicant } from '../../domain/HousingApi';
import { ButtonLink } from '../button';
import { formatDob, getAgeInYears } from '../../lib/utils/dateOfBirth';
import React from 'react';
import { HeadingThree } from '../content/headings';
import { getGenderName } from '../../lib/utils/gender';
import capitalize from '../../lib/utils/capitalize';

interface SummaryProps {
  heading: string;
  others: Applicant[];
  applicationId: string;
  canEdit: boolean;
}

export default function OtherMembers({
  heading,
  others,
  applicationId,
  canEdit,
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
                    </strong>{' '}
                    {getGenderName(applicant) !== ''
                      ? `(${getGenderName(applicant)})`
                      : ''}
                  </li>
                  <li>
                    {applicant.person?.relationshipType &&
                      capitalize(applicant.person?.relationshipType)}
                  </li>
                  <li>
                    {applicant.person?.dateOfBirth &&
                      formatDob(new Date(applicant.person?.dateOfBirth))}{' '}
                    {applicant.person?.dateOfBirth &&
                      `(age ${getAgeInYears(applicant)})`}
                  </li>
                </ul>
              </td>
              <td className="govuk-table__cell govuk-table__cell--numeric">
                {canEdit && (
                  <ButtonLink
                    additionalCssClasses="govuk-secondary lbh-button--secondary lbh-button--inline"
                    href={`/applications/edit/${applicationId}/${applicant.person?.id}/edit-household-member`}
                  >
                    Edit
                  </ButtonLink>
                )}
                <ButtonLink
                  additionalCssClasses="lbh-button--inline"
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
