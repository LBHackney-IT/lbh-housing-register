import { GetServerSideProps } from 'next';
import React, { useState, SyntheticEvent } from 'react';
import { useRouter } from 'next/router';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';
import { UserContext } from '../../lib/contexts/user-context';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import {
  searchApplications,
  getApplications,
} from '../../lib/gateways/applications-api';
import Layout from '../../components/layout/staff-layout';
import SearchBox from '../../components/admin/search-box';
import Sidebar from '../../components/admin/sidebar';
import ApplicationTable from '../../components/admin/application-table';
import { HeadingOne } from '../../components/content/headings';
import Button from '../../components/button';
import {
  HorizontalNav,
  HorizontalNavItem,
} from '../../components/admin/HorizontalNav';

interface PageProps {
  user: HackneyGoogleUser;
  applications: PaginatedApplicationListResponse | null;
  pageUrl: string;
  page: string;
  reference: string;
}

export default function ApplicationListPage({
  user,
  applications,
  pageUrl,
  page = '1',
  reference = '',
}: PageProps): JSX.Element {
  const router = useRouter();
  const parameters = new URLSearchParams();

  if (reference !== '') {
    parameters.append('reference', reference);
  }

  const parsedPage = parseInt(page);

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

  const addCase = async () => {
    router.push({
      pathname: '/applications/add-case',
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
            <Button onClick={() => addCase()}>Add case</Button>
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
              currentPage={parsedPage}
              parameters={parameters}
              pageUrl={pageUrl}
              showStatus={false}
            />
          </div>
        </div>
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSession(context.req);
  const redirect = getRedirect(user);
  if (redirect) {
    return {
      props: {},
      redirect: {
        destination: redirect,
      },
    };
  }

  const {
    page = '1',
    reference = '',
    orderby = '',
    status = 'Submitted',
  } = context.query as {
    page: string;
    reference: string;
    orderby: string;
    status: string;
  };

  const pageUrl = `${process.env.APP_URL}/applications`;

  const applications =
    reference === '' && status === ''
      ? await getApplications(page, user?.email)
      : await searchApplications(page, reference, status, user?.email);

  return {
    props: { user, applications, pageUrl, page, reference },
  };
};
