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
import Button from '../../components/button';
import { HeadingOne } from '../../components/content/headings';
import Layout from '../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import {
  getApplications,
  getApplicationsByStatus,
} from '../../lib/gateways/applications-api';
import { ApplicationStatus } from '../../lib/types/application-status';
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

  const [activeNavItem, setActiveNavItem] = useState('');

  const handleClick = async (event: SyntheticEvent) => {
    event.preventDefault();
    const { name } = event.target as HTMLButtonElement;

    router.push({
      pathname: '/applications/view-register',
      query: { status: name },
    });

    setActiveNavItem(name);
  };

  const addCase = async () => {
    router.push({
      pathname: '/applications/add-case',
    });
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
          watermark="Search application reference"
        />

        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-quarter">
            <Sidebar />
          </div>
          <div className="govuk-grid-column-three-quarters">
            <HeadingOne content="Housing Register" />
            <Button secondary={true} onClick={() => addCase()}>
              + Add new case
            </Button>
            <HorizontalNav>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName=""
                isActive={activeNavItem === ''}
              >
                All applications
              </HorizontalNavItem>
              <HorizontalNavItem
                handleClick={handleClick}
                itemName={ApplicationStatus.MANUAL_DRAFT}
                isActive={activeNavItem === ApplicationStatus.MANUAL_DRAFT}
              >
                Manually added
              </HorizontalNavItem>
            </HorizontalNav>
            <ApplicationTable
              caption="Applications"
              applications={applications}
              initialPaginationToken={
                router.query.paginationToken as string | undefined
              }
              setPaginationToken={setPaginationToken}
              showStatus={true}
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
