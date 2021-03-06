import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PaginatedSearchResultsResponse } from '../../domain/HousingApi';
import Paragraph from '../content/paragraph';
import { formatDate } from '../../lib/utils/dateOfBirth';
import { lookupStatus } from '../../lib/types/application-status';
import SimplePaginationSearch from '../SimplePaginationSearch';
import { ButtonLink } from '../button';

interface ResultsToShowLinkProps {
  query: {};
  numberOfResults: number;
}

const ResultsToShowLink = ({
  query,
  numberOfResults,
}: ResultsToShowLinkProps) => (
  <Link
    href={{
      pathname: '/applications/search-results',
      query: { ...query, pageSize: numberOfResults },
    }}
  >
    <a className="lbh-link lbh-link--no-visited-state">{numberOfResults}</a>
  </Link>
);

interface SearchResultsProps {
  caption?: string;
  applications: PaginatedSearchResultsResponse | null;
  showStatus: boolean;
}

const SearchResults = ({
  caption,
  applications,
  showStatus,
}: SearchResultsProps): JSX.Element => {
  const { query } = useRouter();

  return (
    <>
      {applications ? (
        <>
          <div className="c-flex" style={{ justifyContent: 'space-between' }}>
            <p className="lbh-body-m">
              {applications.totalResults === 1 ? (
                <>{applications.totalResults} application found</>
              ) : (
                <>{applications.totalResults} applications found</>
              )}
            </p>
            <p className="lbh-body-m lbh-!-margin-top-0">
              Number of results to show:{' '}
              <ResultsToShowLink query={query} numberOfResults={5} />
              {' | '}
              <ResultsToShowLink query={query} numberOfResults={10} />
              {' | '}
              <ResultsToShowLink query={query} numberOfResults={50} />
              {' | '}
              <ResultsToShowLink query={query} numberOfResults={100} />
            </p>
          </div>
          {applications.totalResults !== 0 ? (
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
                      Applicants
                    </th>
                    <th scope="col" className="govuk-table__header">
                      Application details
                    </th>
                    <th
                      scope="col"
                      className="govuk-table__header govuk-table__header--numeric"
                    ></th>
                  </tr>
                </thead>
                <tbody className="govuk-table__body">
                  {applications?.results.map((application, index) => (
                    <tr key={index} className="govuk-table__row">
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
                              {application.otherMembers.map((member, index) => (
                                <li key={index} style={{ margin: 0 }}>
                                  <p className="govuk-body govuk-body-s lbh-!-margin-bottom-0 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                                    {member.firstName} {member.surname}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </th>
                      <td scope="row" className="govuk-table__header">
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
                              {lookupStatus(application.status!)}
                            </p>
                          </>
                        ) : null}
                      </td>
                      <td className="govuk-table__cell govuk-table__cell--numeric">
                        <ButtonLink
                          href={`/applications/view/${application.applicationId}`}
                          secondary
                          additionalCssClasses="lbh-!-margin-top-0"
                        >
                          View application
                        </ButtonLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <SimplePaginationSearch
                totalItems={applications.totalResults}
                page={applications.page}
                numberOfItemsPerPage={applications.pageSize}
              />
            </>
          ) : (
            <Paragraph>No applications to show</Paragraph>
          )}
        </>
      ) : null}
    </>
  );
};

export default SearchResults;
