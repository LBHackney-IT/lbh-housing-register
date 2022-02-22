import { GetServerSideProps } from 'next';
import React, { useState, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';
import { UserContext } from '../../lib/contexts/user-context';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import {
  getApplications,
  getApplicationsByStatusAndAssignedTo,
} from '../../lib/gateways/applications-api';
import Layout from '../../components/layout/staff-layout';
import SearchBox from '../../components/admin/search-box';
import Sidebar from '../../components/admin/sidebar';
import ApplicationTable from '../../components/admin/application-table';
import { HeadingOne } from '../../components/content/headings';
import {
  HorizontalNav,
  HorizontalNavItem,
} from '../../components/admin/HorizontalNav';

interface PageProps {
  user?: HackneyGoogleUser;
  applications: PaginatedApplicationListResponse | null;
  pageUrl: string;
  reference: string;
}

export default function ApplicationListPage({
  user,
  applications,
  reference = '',
}: PageProps): JSX.Element {
  const router = useRouter();
  const parameters = new URLSearchParams();

  if (reference !== '') {
    parameters.append('reference', reference);
  }

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

  const setPaginationToken = (paginationToken: string) => {
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
                New Applications
              </HorizontalNavItem>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName="Pending"
                isActive={activeNavItem === 'Pending'}
              >
                Pending application
              </HorizontalNavItem>
            </HorizontalNav>
            <ApplicationTable
              applications={applications}
              initialPaginationToken={
                router.query.paginationToken as string | undefined
              }
              setPaginationToken={setPaginationToken}
              showStatus={false}
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

  const {
    paginationToken = '',
    reference = '',
    status = 'Submitted',
  } = context.query as {
    paginationToken: string;
    reference: string;
    status: string;
  };

  const pageUrl = `${process.env.APP_URL}/applications`;

  const applications =
    reference === '' && status === '' && user === undefined
      ? await getApplications(paginationToken)
      : await getApplicationsByStatusAndAssignedTo(
          status,
          user?.email ?? '',
          paginationToken
        );

  return {
    props: { user, applications, pageUrl, reference },
  };
};
