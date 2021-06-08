import Link from 'next/link';
import { ApplicationList } from '../../domain/application';
import { getStatusTag } from '../../lib/utils/tag';
import Tag from '../tag';

interface TableProps {
  caption?: string;
  applications: ApplicationList;
}

export default function ApplicationTable({
  caption,
  applications,
}: TableProps): JSX.Element {
  return (
    <table className="govuk-table lbh-table">
      {caption && (
        <caption className="govuk-table__caption lbh-heading-h3 lbh-table__caption">
          {caption}
        </caption>
      )}
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            Reference
          </th>
          <th scope="col" className="govuk-table__header">
            Applicant
          </th>
          <th scope="col" className="govuk-table__header">
            Status
          </th>
          <th scope="col" className="govuk-table__header">
            Submitted
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {applications.results.map((application, index) => (
          <tr key={index} className="govuk-table__row">
            <th scope="row" className="govuk-table__header">
              #{application.id}
            </th>
            <td className="govuk-table__cell">
              <Link href={`/applications/${application.id}`}>
                <a className="govuk-link govuk-custom-text-color">
                  {application.mainApplicant.person.title}{' '}
                  {application.mainApplicant.person.firstName}{' '}
                  {application.mainApplicant.person.surname}
                  {application.otherMembers && (
                    <span> + {application.otherMembers.length}</span>
                  )}
                </a>
              </Link>
            </td>
            <td className="govuk-table__cell">
              <Tag
                content={application.status}
                className={getStatusTag(application.status)}
              />
            </td>
            <td className="govuk-table__cell">{application.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
