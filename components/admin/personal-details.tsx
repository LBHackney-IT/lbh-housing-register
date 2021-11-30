import { Applicant } from '../../domain/HousingApi';
import { formatDob, getAgeInYears } from '../../lib/utils/dateOfBirth';
import { getGenderName } from '../../lib/utils/gender';
import Collapsible from '../collapsible';
import Button, { ButtonLink } from '../button';
import app from 'next/app';
import Link from 'next/link';
import React from 'react';
import { HeadingThree } from '../content/headings';
import Hint from '../form/hint';

interface SummaryProps {
  heading: string;
  applicant: Applicant;
  applicationId: string;
}

export default function PersonalDetails({
  heading,
  applicant,
  applicationId,
}: SummaryProps): JSX.Element {
  return (
    <>
      <HeadingThree content={heading} />
      <table className="govuk-table lbh-table" style={{ marginTop: '1em' }}>
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">
              <ul className="lbh-list lbh-list--compressed">
                <li>
                  <strong>
                    {applicant.person?.title} {applicant.person?.firstName}{' '}
                    {applicant.person?.surname}
                  </strong>
                </li>
                <li>Applicant</li>
                <li>
                  {getGenderName(applicant)},{' '}
                  {applicant.person?.dateOfBirth &&
                    formatDob(new Date(applicant.person?.dateOfBirth))}{' '}
                  {applicant.person?.dateOfBirth &&
                    `(age ${getAgeInYears(applicant)})`}
                </li>
              </ul>
              <ul className="lbh-list lbh-list--compressed">
                <li>
                  {applicant.contactInformation?.phoneNumber &&
                    applicant.contactInformation?.phoneNumber}
                </li>
                <li>
                  {applicant.contactInformation?.emailAddress && (
                    <>
                      <Link
                        href={`mailto:${applicant.contactInformation.emailAddress}`}
                      >
                        <a className="lbh-link">
                          {applicant.contactInformation.emailAddress}
                        </a>
                      </Link>
                    </>
                  )}
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
        </tbody>
      </table>
    </>
  );
}
