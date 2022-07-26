import Link from 'next/link';
import React from 'react';
import { PaginatedSearchResultsResponse } from '../../domain/HousingApi';
import Paragraph from '../content/paragraph';
import { formatDate } from '../../lib/utils/dateOfBirth';
import { lookupStatus } from '../../lib/types/application-status';
import Pagination from '../Pagination';
import SimplePaginationSearch from '../SimplePaginationSearch';
import { ButtonLink } from '../button';
// import { getPersonName } from '../../lib/utils/person';
// import SimplePagination from '../SimplePagination';
// import { applicantHasId } from '../../lib/store/applicant';

interface TableProps {
  caption?: string;
  applications: PaginatedSearchResultsResponse | null;
  showStatus: boolean;
}

export default function SearchResults({
  caption,
  applications,
  showStatus,
}: TableProps): JSX.Element {
  // console.log('applications', applications);

  return (
    <>
      {applications ? (
        <>
          <p className="lbh-body-m">
            {applications.totalResults === 1 ? (
              <>{applications.totalResults} application found</>
            ) : (
              <>{applications.totalResults} applications found</>
            )}
          </p>
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
                  {applications?.results.map((application, index) => {
                    console.log(application);

                    return (
                      <tr key={index} className="govuk-table__row">
                        <th className="govuk-table__cell">
                          <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-0">
                            Main applicant:
                          </p>
                          <p className="govuk-body govuk-body-s lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                            {application.firstName} {application.surname}
                          </p>

                          {application.dateOfBirth ? (
                            <>
                              <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                                Date of birth:
                              </p>
                              <p className="govuk-body govuk-body-s lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                                {formatDate(application.dateOfBirth)}
                              </p>
                            </>
                          ) : null}

                          {application.nationalInsuranceNumber ? (
                            <>
                              <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                                NI number:
                              </p>
                              <p className="govuk-body govuk-body-s lbh-!-margin-top-0 lbh-!-margin-bottom-0 lbh-!-font-weight-bold">
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
                                {application.otherMembers.map(
                                  (member, index) => (
                                    <li key={index} style={{ margin: 0 }}>
                                      <p className="govuk-body govuk-body-s lbh-!-margin-bottom-0 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                                        {member.firstName} {member.surname}
                                      </p>
                                    </li>
                                  )
                                )}
                              </ul>
                            </>
                          ) : null}
                        </th>
                        <td scope="row" className="govuk-table__header">
                          {/* {application.reference
                            ? 'Legacy application'
                            : application.reference} */}
                          {application.reference ? (
                            <>
                              <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-0">
                                Reference number:
                              </p>
                              <p className="govuk-body govuk-body-s lbh-!-margin-top-0 lbh-!-font-weight-bold">
                                {application.reference}
                              </p>
                            </>
                          ) : (
                            <p className="govuk-body govuk-body-s lbh-!-margin-top-0 lbh-!-font-weight-bold">
                              Legacy application
                            </p>
                          )}
                          {application.biddingNumber ? (
                            <>
                              <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                                Bidding number:
                              </p>
                              <p className="govuk-body govuk-body-s lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                                {application.biddingNumber}
                              </p>
                            </>
                          ) : null}

                          {application.submittedAt ? (
                            <>
                              <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                                Submitted date:
                              </p>
                              <p className="govuk-body govuk-body-s lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
                                {formatDate(application.submittedAt)}
                              </p>
                            </>
                          ) : null}

                          {showStatus ? (
                            <>
                              <p className="govuk-body govuk-body-xs lbh-!-margin-bottom-0 lbh-!-margin-top-1">
                                Status:
                              </p>
                              <p className="govuk-body govuk-body-s lbh-!-margin-bottom-1 lbh-!-margin-top-0 lbh-!-font-weight-bold">
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
                    );
                  })}
                </tbody>
              </table>

              {/* <Pagination
                totalItems={applications.totalResults}
                page={applications.page}
                numberOfItemsPerPage={applications.pageSize}
                pageUrl={pageUrl}
              /> */}

              <SimplePaginationSearch
                totalItems={applications.totalResults}
                page={applications.page}
                numberOfItemsPerPage={applications.pageSize}
                // pageUrl={pageUrl}
              />
            </>
          ) : (
            <Paragraph>No applications to show</Paragraph>
          )}
        </>
      ) : null}
    </>
  );
}
