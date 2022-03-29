import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { SyntheticEvent, useState } from 'react';
import ApplicationTable from '../../components/admin/application-table';
import {
  HorizontalNav,
  HorizontalNavItem,
} from '../../components/admin/HorizontalNav';
import SearchBox from '../../components/admin/search-box';
import Sidebar from '../../components/admin/sidebar';
import { HeadingOne } from '../../components/content/headings';
import Layout from '../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import { getApplicationsByStatusAndAssignedTo } from '../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';

interface PageProps {
  user?: HackneyGoogleUser;
  applications: PaginatedApplicationListResponse | null;
}

export default function ApplicationListPage({
  user,
  applications,
}: PageProps): JSX.Element {
  const router = useRouter();

  const [activeNavItem, setActiveNavItem] = useState('Submitted');

  const handleClick = async (event: SyntheticEvent) => {
    event.preventDefault();
    const { name } = event.target as HTMLButtonElement;

    router.push({
      pathname: '/applications',
      query: { status: name },
    });

    setActiveNavItem(name);
  };

  const setPaginationToken = (paginationToken: string | null) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, paginationToken },
    });
  };
  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="My worktray">
        <SearchBox
          title="Housing Register"
          buttonTitle="Search"
          watermark="Search application reference"
        />

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-quarter">
            <Sidebar />
          </div>
          <div className="govuk-grid-column-three-quarters">
            <HeadingOne content="My worktray" />
            <HorizontalNav>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName="Submitted"
                isActive={activeNavItem === 'Submitted'}
              >
                New applications
              </HorizontalNavItem>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName="AwaitingReassessment"
                isActive={activeNavItem === 'AwaitingReassessment'}
              >
                Reviews
              </HorizontalNavItem>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName="Pending"
                isActive={activeNavItem === 'Pending'}
              >
                Pending
              </HorizontalNavItem>
            </HorizontalNav>
            <ApplicationTable
              applications={applications}
              initialPaginationToken={
                router.query.paginationToken as string | undefined
              }
              setPaginationToken={setPaginationToken}
              showStatus={false}
              key={activeNavItem} // force remounting for a new initialPaginationToken
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

  const { status = 'Submitted', paginationToken } = context.query as {
    status: string;
    paginationToken: string;
  };

  const applications = await getApplicationsByStatusAndAssignedTo(
    status,
    user?.email ?? '',
    paginationToken
  );

  return {
    props: { user, applications },
  };
};
