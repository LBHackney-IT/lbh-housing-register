import Link from 'next/link';
import React from 'react';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import { getStatusTag } from '../../lib/utils/tag';
import Paragraph from '../content/paragraph';
import Tag from '../tag';
import Pagination from '../pagination';

export function formatDate(date: string | undefined) {
  if (!date) return '';
  return `${new Date(date).toLocaleString('default', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;
}

interface TableProps {
  caption?: string;
  applications: PaginatedApplicationListResponse;
  currentPage: number;
  pageUrl: string;
  parameters: URLSearchParams;
}

export default function ApplicationTable({
  caption,
  applications,
  currentPage,
  pageUrl,
  parameters,
}: TableProps): JSX.Element {
  return (
    <>
      {applications.results.length > 0 ? (
        <>
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
                  Submitted
                </th>
                <th scope="col" className="govuk-table__header">
                  Status
                </th>
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
                        {application.mainApplicant?.person?.title}{' '}
                        {application.mainApplicant?.person?.firstName}{' '}
                        {application.mainApplicant?.person?.surname}
                        {application.otherMembers && (
                          <span> + {application.otherMembers.length}</span>
                        )}
                      </a>
                    </Link>
                  </td>
                  <td className="govuk-table__cell">
                    {formatDate(application.createdAt)}
                  </td>
                  <td className="govuk-table__cell">
                    <Tag
                      content={application.status || ''}
                      className={getStatusTag(application.status || '')}
                    />
                  </td>
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
