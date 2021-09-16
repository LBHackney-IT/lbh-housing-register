import { GetServerSideProps } from 'next';
import ApplicationTable from '../../components/applications/application-table';
import { HeadingOne } from '../../components/content/headings';
import Layout from '../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { PaginatedApplicationListResponse } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import {
  searchApplications,
  getApplications,
} from '../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../lib/utils/auth';
import SearchBox from '../../components/applications/searchBox';
import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface PageProps {
  user: HackneyGoogleUser;
  applications: PaginatedApplicationListResponse;
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
  const [searchInputValue, setsearchInputValue] = useState('');
  const router = useRouter();
  const parameters = new URLSearchParams();

  if (reference !== '') {
    parameters.append('reference', reference);
  }

  const parsedPage = parseInt(page);

  const textChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): React.ChangeEvent<HTMLInputElement> => {
    setsearchInputValue(event.target.value);
    return event;
  };

  const onSearchSubmit = async () => {
    router.push({
      pathname: '/applications',
      query: { reference: searchInputValue },
    });
  };

  const filterByStatus = async (status: string) => {
    router.push({
      pathname: '/applications',
      query: { status: status },
    });
  };

  return (
    <UserContext.Provider value={{ user }}>
      <Layout pageName="Manage applications">
        <SearchBox
          title="Housing Register"
          buttonTitle="Search"
          watermark="Search application reference"
          onSearch={onSearchSubmit}
          textChangeHandler={textChangeHandler}
        />
        <HeadingOne content="View housing register" />

        <button
          onClick={() => {
            filterByStatus('new');
          }}
          className="lbh-link lbh-link--no-visited-state"
        >
          New applications
        </button>
        <button
          onClick={() => {
            filterByStatus('pending');
          }}
          className="lbh-link lbh-link--no-visited-state"
        >
          Pending applications
        </button>

        <ApplicationTable
          caption="Applications"
          applications={applications}
          currentPage={parsedPage}
          parameters={parameters}
          pageUrl={pageUrl}
        />
      </Layout>
    </UserContext.Provider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = getSession(context.req);
  const redirect = getRedirect(
    process.env.AUTHORISED_ADMIN_GROUP as string,
    user
  );
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
    status = '',
  } = context.query as {
    page: string;
    reference: string;
    orderby: string;
    status: string;
  };

  const pageUrl = `${process.env.APP_URL}/applications`;

  const applications =
    reference === '' && status === ''
      ? await getApplications(page)
      : await searchApplications(page, reference, status);

  return {
    props: { user, applications, pageUrl, page, reference },
  };
};
