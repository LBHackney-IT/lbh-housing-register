import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import React, { SyntheticEvent, useState } from 'react';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';
import { UserContext } from '../../lib/contexts/user-context';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import {
  getApplicationsByStatus,
  getApplications,
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
import { useRouter } from 'next/router';
import { ApplicationStatus } from '../../lib/types/application-status';
import Button from '../../components/button';

interface PageProps {
  user?: HackneyGoogleUser;
  applications: PaginatedApplicationListResponse | null;
  pageUrl: string;
  reference: string;
}

export default function ViewAllApplicationsPage({
  user,
  applications,
  reference = '',
}: PageProps): JSX.Element {
  const router = useRouter();
  const parameters = new URLSearchParams();

  if (reference !== '') {
    parameters.append('reference', reference);
  }

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

  const setPaginationToken = (paginationToken: string) => {
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

  const {
    paginationToken = '',
    reference = '',
    status = '',
  } = context.query as {
    paginationToken: string;
    reference: string;
    status: string;
  };

  const pageUrl = `${process.env.APP_URL}/applications/view-register`;

  const applications =
    reference === '' && status === ''
      ? await getApplications(paginationToken)
      : await getApplicationsByStatus(paginationToken, status);

  return {
    props: { user, applications, pageUrl, reference },
  };
};
