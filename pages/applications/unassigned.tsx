import { SyntheticEvent, useEffect, useState } from 'react';

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
import Layout from '../../components/layout/staff-layout';
import SimplePaginationSearch from '../../components/SimplePaginationSearch';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import {
  APPLICATION_UNNASIGNED,
  PaginatedSearchResultsResponse,
} from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import { getApplicationsByStatusAndAssignedTo } from '../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';

interface PageProps {
  user?: HackneyGoogleUser;
  applications: PaginatedSearchResultsResponse | null;
  page: string;
  pageSize: string;
}

export default function ApplicationListPage({
  user,
  applications,
  page,
  pageSize,
}: PageProps): JSX.Element {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState('Submitted');

  useEffect(() => {
    router.push({
      query: { ...router.query, status: activeNavItem, page, pageSize },
    });
  }, [activeNavItem]);

  const handleSelectNavItem = async (event: SyntheticEvent) => {
    event.preventDefault();
    const { name } = event.target as HTMLButtonElement;
    setActiveNavItem(name);
  };
  /*  eslint-disable react/jsx-no-constructed-context-values */
  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Group worktray">
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
            <HeadingOne content="Group worktray" />
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
            </HorizontalNav>
            {applications ? (
              <>
                <ApplicationsTable
                  applications={applications}
                  showStatus={true} /* eslint-disable-line */
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
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const user = getSession(context.req);
  const redirect = getRedirect(user, true);
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

  const applications = await getApplicationsByStatusAndAssignedTo(
    status,
    APPLICATION_UNNASIGNED,
    page,
    pageSize
  );

  return {
    props: { user, applications, page, pageSize },
  };
};
