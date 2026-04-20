import React, { MouseEvent, useEffect, useState } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import ApplicationsTable from '../../components/admin/ApplicationsTable';
import {
  HorizontalNav,
  HorizontalNavItem,
} from '../../components/admin/HorizontalNav';
import SearchBox from '../../components/admin/SearchBox';
import Sidebar from '../../components/admin/sidebar';
import { HeadingOne } from '../../components/content/headings';
import ErrorSummary from '../../components/errors/error-summary';
import Layout from '../../components/layout/staff-layout';
import SimplePaginationSearch from '../../components/SimplePaginationSearch';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { PaginatedSearchResultsResponse } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import { getApplicationsByStatusAndAssignedTo } from '../../lib/gateways/applications-api';
import {
  HackneyGoogleUserWithPermissions,
  getRedirect,
  getSession,
  hasReadOnlyPermissionOnly,
} from '../../lib/utils/googleAuth';

interface PageProps {
  user?: HackneyGoogleUser;
  applications: PaginatedSearchResultsResponse | null;
  page: string;
  pageSize: string;
  /** Set when the Housing Register API fails (e.g. 500) so the page still renders. */
  worktrayLoadError?: string;
}

export default function ApplicationListPage({
  user,
  applications,
  page,
  pageSize,
  worktrayLoadError,
}: PageProps): JSX.Element {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState('Submitted');

  useEffect(() => {
    router.push({
      query: { ...router.query, status: activeNavItem, page, pageSize },
    });
  }, [activeNavItem]);

  const handleSelectNavItem = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { name } = event.currentTarget;
    setActiveNavItem(name);
  };

  return (
    // noting here the possibility of unecessary re-renders that will need some investigation.
    <UserContext.Provider value={{ user }}>
      <Layout pageName="My worktray" dataTestId="test-applications-page">
        <SearchBox
          title="Housing Register"
          buttonTitle="Search"
          watermark="Search all applications (name, reference, bidding number)"
        />
        {!hasReadOnlyPermissionOnly(
          user as HackneyGoogleUserWithPermissions,
        ) && (
          <div
            className="govuk-grid-row"
            data-testid="test-applications-worktray"
          >
            <div className="govuk-grid-column-one-quarter">
              <Sidebar />
            </div>
            <div className="govuk-grid-column-three-quarters">
              <HeadingOne content="My worktray" />
              <HorizontalNav>
                <HorizontalNavItem
                  handleSelectNavItem={handleSelectNavItem}
                  itemName="Submitted"
                  isActive={activeNavItem === 'Submitted'}
                >
                  New applications
                </HorizontalNavItem>
                <HorizontalNavItem
                  handleSelectNavItem={handleSelectNavItem}
                  itemName="AwaitingReassessment"
                  isActive={activeNavItem === 'AwaitingReassessment'}
                >
                  Reviews
                </HorizontalNavItem>
                <HorizontalNavItem
                  handleSelectNavItem={handleSelectNavItem}
                  itemName="Pending"
                  isActive={activeNavItem === 'Pending'}
                >
                  Pending
                </HorizontalNavItem>
              </HorizontalNav>
              {worktrayLoadError ? (
                <ErrorSummary dataTestId="test-worktray-load-error">
                  {worktrayLoadError}
                </ErrorSummary>
              ) : null}
              {applications ? (
                <>
                  <ApplicationsTable
                    applications={applications}
                    showStatus
                    page={page}
                    pageSize={pageSize}
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
        )}
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
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
    status = 'Submitted',
    page = '1',
    pageSize = '10',
  } = context.query as {
    status: string;
    page: string;
    pageSize: string;
  };

  let applications: PaginatedSearchResultsResponse | null = null;
  let worktrayLoadError: string | undefined;

  try {
    applications = await getApplicationsByStatusAndAssignedTo(
      status,
      user?.email ?? '',
      page,
      pageSize,
    );
  } catch (err) {
    console.error(
      '[applications/index] getApplicationsByStatusAndAssignedTo failed',
      err,
    );
    worktrayLoadError =
      'Unable to load your worktray. The Housing Register API returned an error — check the service is running and HOUSING_REGISTER_API / key are correct.';
  }

  return {
    props: {
      user,
      applications,
      page,
      pageSize,
      ...(worktrayLoadError !== undefined ? { worktrayLoadError } : {}),
    },
  };
};
