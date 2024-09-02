import React from 'react';

import Link from 'next/link';

import { Applicant } from '../../domain/HousingApi';
import { formatDob } from '../../lib/utils/dateOfBirth';
import { getGenderName } from '../../lib/utils/gender';
import { ButtonLink } from '../button';
import { HeadingThree } from '../content/headings';

interface SummaryProps {
  heading: string;
  applicant: Applicant;
  applicationId: string;
  canEdit: boolean;
}

export default function PersonalDetails({
  heading,
  applicant,
  applicationId,
  canEdit,
}: SummaryProps): JSX.Element {
  return (
    <>
      <HeadingThree content={heading} />
      <table
        className="govuk-table lbh-table"
        style={{ marginTop: '1em' }}
        data-testid="test-applicant-table"
      >
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
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
                  {applicant.person?.dateOfBirth &&
                    formatDob(new Date(applicant.person?.dateOfBirth))}{' '}
                  {applicant.person?.age && `(age ${applicant.person?.age})`}
                </li>
              </ul>
              <ul className="lbh-list lbh-list--compressed">
                <li>
                  {applicant.contactInformation?.phoneNumber &&
                    applicant.contactInformation?.phoneNumber}
                </li>
                <li>
                  {applicant.contactInformation?.emailAddress && (
                    <Link
                      href={`mailto:${applicant.contactInformation.emailAddress}`}
                    >
                      <a className="lbh-link">
                        {applicant.contactInformation.emailAddress}
                      </a>
                    </Link>
                  )}
                </li>
              </ul>
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              {canEdit && (
                <ButtonLink
                  additionalCssClasses="govuk-secondary lbh-button--secondary lbh-button--inline"
                  href={`/applications/edit/${applicationId}/${applicant.person?.id}`}
                  dataTestId={`test-edit-applicant-button-${applicant.person?.id}`}
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
        </tbody>
      </table>
    </>
  );
}
