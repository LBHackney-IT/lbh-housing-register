import { Applicant } from '../../domain/HousingApi';
import Button from '../../components/button';
import { formatDob, getAgeInYears } from '../../lib/utils/dateOfBirth';
import Link from 'next/link';

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
        {others.map((applicant, index) => (
          <tr className="govuk-table__row">
            <td className="govuk-table__cell">
              <strong>
                {applicant.person?.title} {applicant.person?.firstName}{' '}
                {applicant.person?.surname}
              </strong>
              <br />
              {applicant.person?.relationshipType}
              <br />
              {applicant.person?.gender},{' '}
              {applicant.person?.dateOfBirth &&
                formatDob(new Date(applicant.person?.dateOfBirth))}{' '}
              {applicant.person?.dateOfBirth &&
                `(age ${getAgeInYears(applicant)})`}
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
        ))}
      </tbody>
    </table>
  );
}
