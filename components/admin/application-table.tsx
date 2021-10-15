import Link from 'next/link';
import React from 'react';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import Paragraph from '../content/paragraph';
import Pagination from '../pagination';
import { formatDate } from '../../lib/utils/dateOfBirth';
import { getPersonName } from '../../lib/utils/person';
import { lookupStatus } from '../../lib/types/application-status';

interface TableProps {
  caption?: string;
  applications: PaginatedApplicationListResponse | null;
  currentPage: number;
  pageUrl: string;
  parameters: URLSearchParams;
  showStatus: boolean;
}

export default function ApplicationTable({
  caption,
  applications,
  currentPage,
  pageUrl,
  parameters,
  showStatus,
}: TableProps): JSX.Element {
  return (
    <>
      {applications && applications.results.length > 0 ? (
        <>
          <table className="govuk-table lbh-table">
            {caption && (
              <caption className="govuk-table__caption lbh-heading-h3 lbh-table__caption">
                {caption}
              </caption>
            )}
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th
                  scope="col"
                  className="govuk-table__header"
                  style={{ width: '150px' }}
                >
                  Reference
                </th>
                <th scope="col" className="govuk-table__header">
                  Applicant
                </th>
                <th
                  scope="col"
                  className="govuk-table__header"
                  style={{ width: '150px' }}
                >
                  Submitted
                </th>
                {showStatus && (
                  <th scope="col" className="govuk-table__header">
                    Status
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {applications?.results.map((application, index) => (
                <tr key={index} className="govuk-table__row">
                  <th scope="row" className="govuk-table__header">
                    #{application.reference}
                  </th>
                  <td className="govuk-table__cell">
                    <Link href={`/applications/view/${application.id}`}>
                      <a className="govuk-link govuk-custom-text-color">
                        {getPersonName(application)}
                      </a>
                    </Link>
                  </td>
                  <td className="govuk-table__cell">
                    {formatDate(application.submittedAt)}
                  </td>
                  {showStatus && (
                    <td className="govuk-table__cell">
                      {lookupStatus(application.status!)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalItems={applications.totalItems}
            page={currentPage}
            numberOfItemsPerPage={applications.numberOfItemsPerPage}
            totalNumberOfPages={applications.totalNumberOfPages}
            pageStartOffSet={applications.pageStartOffSet}
            pageEndOffSet={applications.pageEndOffSet}
            pageUrl={pageUrl}
            parameters={parameters}
          />
        </>
      ) : (
        <Paragraph>No applications to show</Paragraph>
      )}
    </>
  );
}
