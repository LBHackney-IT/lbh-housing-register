import React from 'react';

import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { PaginatedSearchResultsResponse } from '../../domain/HousingApi';
import { lookupStatus } from '../../lib/types/application-status';
import { formatDate } from '../../lib/utils/dateOfBirth';
import { ButtonLink } from '../button';
import Paragraph from '../content/paragraph';

interface ResultsToShowLinkProps {
  query: NextParsedUrlQuery;
  numberOfResults: number;
}

const ResultsToShowLink = ({
  query,
  numberOfResults,
}: ResultsToShowLinkProps) =>
  parseInt(query.pageSize as string, 10) !== numberOfResults ? (
    <Link
      href={{
        query: { ...query, pageSize: numberOfResults },
      }}
    >
      <a className="lbh-link lbh-link--no-visited-state">{numberOfResults}</a>
    </Link>
  ) : (
    <span>{numberOfResults}</span>
  );

interface ApplicationsTableProps {
  applications: PaginatedSearchResultsResponse | null;
  showStatus: boolean;
  page: string;
  pageSize: string;
}

export default function ApplicationsTable({
  applications,
  showStatus,
  page,
  pageSize,
}: ApplicationsTableProps): JSX.Element {
  const { query } = useRouter();
  const firstResult = (parseInt(page, 10) - 1) * parseInt(pageSize, 10) + 1;
  const lastResult = Math.min(
    firstResult + parseInt(pageSize, 10) - 1,
    applications?.totalResults || 0
  );

  const applicationResultsTotalText = () => {
    if (!applications) {
      return null;
    }
    if (applications.totalResults === 1) {
      return <>{applications.totalResults} application found</>;
    }
    if (applications.totalResults > 10) {
      return (
        <>
          Showing {firstResult} to {lastResult} of {applications.totalResults}{' '}
          applications
        </>
      );
    }
    return <>{applications.totalResults} applications found</>;
  };

  return (
    <>
      {applications && applications.totalResults > 0 ? (
        <>
          <div className="c-flex" style={{ justifyContent: 'space-between' }}>
            <p className="lbh-body-m lbh-body-bold">
              {applicationResultsTotalText()}
            </p>
            {applications.totalResults > 10 ? (
              <div className="lbh-!-margin-top-0 lbh-!-margin-left-1">
                <p className="lbh-body-m lbh-!-margin-top-0">Results to show</p>
                <p className="lbh-body-m lbh-!-margin-top-0">
                  <ResultsToShowLink query={query} numberOfResults={5} />
                  {' | '}
                  <ResultsToShowLink query={query} numberOfResults={10} />

                  {applications.totalResults > 50 ? (
                    <>
                      {' | '}
                      <ResultsToShowLink query={query} numberOfResults={50} />
                    </>
                  ) : null}
                  {applications.totalResults > 100 ? (
                    <>
                      {' | '}
                      <ResultsToShowLink query={query} numberOfResults={100} />
                    </>
                  ) : null}
                </p>
              </div>
            ) : null}
          </div>
          <table className="govuk-table lbh-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header">
                  Applicants
                </th>
                <th scope="col" className="govuk-table__header">
                  Application details
                </th>
                <th
                  scope="col"
                  className="govuk-table__header govuk-table__header--numeric"
                  aria-label="View application"
                />
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {applications?.results.map((application) => (
                <tr
                  key={application.applicationId}
                  className="govuk-table__row"
                >
                  <th className="govuk-table__cell">
                    <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-0">
                      Main applicant
                    </p>
                    <p className="govuk-body govuk-body-m lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                      {application.firstName} {application.surname}
                    </p>

                    {application.dateOfBirth ? (
                      <>
                        <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                          Date of birth
                        </p>
                        <p className="govuk-body govuk-body-m lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                          {formatDate(application.dateOfBirth)}
                        </p>
                      </>
                    ) : null}

                    {application.nationalInsuranceNumber ? (
                      <>
                        <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                          NI number
                        </p>
                        <p className="govuk-body govuk-body-m lbh-!-margin-top-0 lbh-!-margin-bottom-0 lbh-!-font-weight-bold">
                          {application.nationalInsuranceNumber}
                        </p>
                      </>
                    ) : null}

                    {application.otherMembers?.length > 0 ? (
                      <>
                        <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                          Other household members
                        </p>
                        <ul className="govuk-list lbh-list lbh-list--bullet lbh-!-margin-top-0">
                          {application.otherMembers.map((member) => (
                            <li key={member.id} style={{ margin: 0 }}>
                              <p className="govuk-body govuk-body-s lbh-!-margin-bottom-0 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                                {member.firstName} {member.surname}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </th>
                  <td className="govuk-table__header">
                    {application.reference ? (
                      <>
                        <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-0">
                          Reference number
                        </p>
                        <p className="govuk-body govuk-body-m lbh-!-margin-top-0 lbh-!-margin-bottom-0 lbh-!-font-weight-bold">
                          {application.reference}
                        </p>
                      </>
                    ) : (
                      <p className="govuk-body govuk-body-m lbh-!-margin-top-0 lbh-!-font-weight-bold">
                        Legacy application
                      </p>
                    )}
                    {application.biddingNumber ? (
                      <>
                        <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                          Bidding number
                        </p>
                        <p className="govuk-body govuk-body-m lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                          {application.biddingNumber}
                        </p>
                      </>
                    ) : null}

                    {application.submittedAt ? (
                      <>
                        <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                          Submitted date
                        </p>
                        <p className="govuk-body govuk-body-m lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                          {formatDate(application.submittedAt)}
                        </p>
                      </>
                    ) : null}

                    {showStatus ? (
                      <>
                        <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                          Status
                        </p>
                        <p className="govuk-body govuk-body-m lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                          {application.status
                            ? lookupStatus(application.status)
                            : ''}
                        </p>
                      </>
                    ) : null}
                  </td>
                  <td className="govuk-table__cell govuk-table__cell--numeric">
                    <ButtonLink
                      href={`/applications/view/${application.applicationId}`}
                      secondary
                      additionalCssClasses="lbh-!-margin-top-0"
                      dataTestId={`test-view-application-link-${application.applicationId}`}
                    >
                      View application
                    </ButtonLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <Paragraph>No applications to show</Paragraph>
      )}
    </>
  );
}
