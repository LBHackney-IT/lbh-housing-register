import { Applicant } from '../../domain/HousingApi';
import { formatDob } from '../../lib/utils/dateOfBirth';
import { getGenderName } from '../../lib/utils/gender';
import Collapsible from '../collapsible';
import Button from '../../components/button';
import app from 'next/app';
import Link from 'next/link';

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
    <table className="govuk-table lbh-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Person details
          </th>
          <th scope="col" className="govuk-table__header"></th>
          <th scope="col" className="govuk-table__header"></th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">
            <strong>
              {applicant.person?.title} {applicant.person?.firstName}{' '}
              {applicant.person?.surname}
            </strong>
            <br />
            Applicant {applicant.person?.gender}{' '}
            {applicant.person?.dateOfBirth &&
              formatDob(new Date(applicant.person?.dateOfBirth))}
            <br />
            {applicant.contactInformation?.phoneNumber &&
              applicant.contactInformation.phoneNumber}
            {applicant.contactInformation?.emailAddress && (
              <Link
                href={`mailto:${applicant.contactInformation.emailAddress}`}
              >
                {applicant.contactInformation.emailAddress}
              </Link>
            )}
          </td>
          <td className="govuk-table__cell"></td>
          <td className="govuk-table__cell">
            <Link
              href={`/applications/${applicationId}/${applicant.person?.id}`}
            >
              <Button>Open</Button>
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
