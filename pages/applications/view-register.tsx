import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import ApplicationTable from '../../components/admin/application-table';
import SearchBox from '../../components/admin/search-box';
import Sidebar from '../../components/admin/sidebar';
import Button from '../../components/button';
import Details from '../../components/details';
import { HeadingOne } from '../../components/content/headings';
import Layout from '../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import {
  getApplications,
  getApplicationsByStatus,
} from '../../lib/gateways/applications-api';
import {
  ApplicationStatus,
  lookupStatus,
} from '../../lib/types/application-status';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';

interface PageProps {
  user?: HackneyGoogleUser;
  applications: PaginatedApplicationListResponse | null;
}

export default function ViewAllApplicationsPage({
  user,
  applications,
}: PageProps): JSX.Element {
  const router = useRouter();
  const activeItem = (router.query.status ?? '') as ApplicationStatus | '';
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    router.push({
      pathname: '/applications/view-register',
      query: { status: selectedFilter },
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
          title="All applications"
          buttonTitle="Search"
          watermark="Search application reference"
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
                      {lookupStatus(value)}
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

            <ApplicationTable
              applications={applications}
              initialPaginationToken={
                router.query.paginationToken as string | undefined
              }
              setPaginationToken={setPaginationToken}
              showStatus={true}
              key={activeItem} // force remounting for a new initialPaginationToken
            />
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

  const { status = '', paginationToken } = context.query as {
    status: string;
    paginationToken: string;
  };

  const applications =
    status === ''
      ? await getApplications(paginationToken)
      : await getApplicationsByStatus(status, paginationToken);

  return {
    props: { user, applications },
  };
};
