import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import ApplicationsTable from '../../components/admin/ApplicationsTable';
import SimplePaginationSearch from '../../components/SimplePaginationSearch';
import SearchBox from '../../components/admin/SearchBox';
import Sidebar from '../../components/admin/sidebar';
import Button from '../../components/button';
import Details from '../../components/details';
import { HeadingOne } from '../../components/content/headings';
import Layout from '../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { PaginatedSearchResultsResponse } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import {
  getApplications,
  getApplicationsByStatus,
  getApplicationStatusCounts,
} from '../../lib/gateways/applications-api';
import {
  ApplicationStatus,
  lookupStatus,
} from '../../lib/types/application-status';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';

interface PageProps {
  user?: HackneyGoogleUser;
  applications: PaginatedSearchResultsResponse | null;
  applicationStatusCounts: { [key in ApplicationStatus]: number };
}

export default function ViewAllApplicationsPage({
  user,
  applications,
  applicationStatusCounts,
}: PageProps): JSX.Element {
  // console.log('applications', applications);

  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    router.push({
      pathname: '/applications/view-register',
      query: { ...router.query, status: selectedFilter },
    });
  }, [selectedFilter]);

  const addCase = async () => {
    router.push({
      pathname: '/applications/add-case',
    });
  };

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { value } = event.target;
    setSelectedFilter(value);
  };

  const handleRemoveFilters = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setSelectedFilter('');
  };

  const setPaginationToken = (paginationToken: string | null) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, paginationToken },
    });
  };

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="All applications">
        <SearchBox
          title="Housing Register"
          buttonTitle="Search"
          watermark="Search all applications (name, reference, bidding number)"
        />

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-quarter">
            <Sidebar />
          </div>
          <div className="govuk-grid-column-three-quarters">
            <div className="lbh-flex-heading">
              <HeadingOne content="All applications" />
              <Button secondary={true} onClick={() => addCase()}>
                + Add new case
              </Button>
            </div>
            <Details summary="Filter by status">
              <div
                className="govuk-radios govuk-radios--inline govuk-radios--small lbh-radios"
                role="group"
                aria-labelledby="radio-group"
              >
                {Object.entries(ApplicationStatus).map(([key, value]) => (
                  <div
                    className="govuk-radios__item govuk-radios__item--fixed-width"
                    key={key}
                  >
                    <input
                      className="govuk-radios__input"
                      value={value}
                      id={value}
                      name="filters"
                      type="radio"
                      checked={selectedFilter === value}
                      onChange={handleFilterChange}
                    />
                    <label
                      className="govuk-radios__label lbh-!-margin-top-0"
                      htmlFor={value}
                    >
                      {lookupStatus(value)} (
                      {applicationStatusCounts[value] ?? 0})
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={handleRemoveFilters}
                className="lbh-link lbh-link--no-visited-state lbh-!-margin-top-1"
              >
                Clear all filters
              </button>
            </Details>

            {applications ? (
              <>
                <ApplicationsTable
                  applications={applications}
                  showStatus={true}
                />

                <SimplePaginationSearch
                  totalItems={applications.totalResults}
                  page={applications.page}
                  numberOfItemsPerPage={applications.pageSize}
                />
              </>
            ) : null}
          </div>
        </div>
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const user = getSession(context.req);
  const redirect = getRedirect(user);
  if (redirect) {
    return {
      redirect: {
        permanent: false,
        destination: redirect,
      },
    };
  }

  const {
    status = '',
    page = '',
    pageSize = '',
  } = context.query as {
    status: string;
    page: string;
    pageSize: string;
  };

  const applicationStatusCounts = await getApplicationStatusCounts();

  const applications =
    status === ''
      ? await getApplications(page, pageSize)
      : await getApplicationsByStatus(status, page, pageSize);

  return {
    props: { user, applications, applicationStatusCounts },
  };
};
