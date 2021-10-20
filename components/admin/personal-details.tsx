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
              <strong>
                {applicant.person?.title} {applicant.person?.firstName}{' '}
                {applicant.person?.surname}
              </strong>
              <br />
              Applicant
              <br />
              {getGenderName(applicant)},{' '}
              {applicant.person?.dateOfBirth &&
                formatDob(new Date(applicant.person?.dateOfBirth))}{' '}
              {applicant.person?.dateOfBirth &&
                `(age ${getAgeInYears(applicant)})`}
              <br />
              {applicant.contactInformation?.phoneNumber && (
                <>
                  <br />
                  {applicant.contactInformation?.phoneNumber}
                </>
              )}
              {applicant.contactInformation?.emailAddress && (
                <>
                  <br />
                  <Link
                    href={`mailto:${applicant.contactInformation.emailAddress}`}
                  >
                    <a className="lbh-link">
                      {applicant.contactInformation.emailAddress}
                    </a>
                  </Link>
                </>
              )}
            </td>
            <td className="govuk-table__cell govuk-table__cell--numeric">
              <ButtonLink
                href={`/applications/view/${applicationId}/${applicant.person?.id}`}
              >
                Open
              </ButtonLink>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
