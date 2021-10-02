import { GetServerSideProps } from 'next';
import React from 'react';
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

interface PageProps {
  user: HackneyGoogleUser;
  applications: PaginatedApplicationListResponse;
  pageUrl: string;
  page: string;
  reference: string;
}

export default function ViewAllApplicationsPage({
  user,
  applications,
  pageUrl,
  page = '1',
  reference = '',
}: PageProps): JSX.Element {
  const parameters = new URLSearchParams();

  if (reference !== '') {
    parameters.append('reference', reference);
  }

  const parsedPage = parseInt(page);

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
            <HeadingOne content="All applications" />
            <ApplicationTable
              caption="Applications"
              applications={applications}
              currentPage={parsedPage}
              parameters={parameters}
              pageUrl={pageUrl}
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
    status = '',
  } = context.query as {
    page: string;
    reference: string;
    orderby: string;
    status: string;
  };

  const pageUrl = `${process.env.APP_URL}/applications/view-register`;

  const applications =
    reference === '' && status === ''
      ? await getApplications(page)
      : await searchApplications(page, reference, status);

  return {
    props: { user, applications, pageUrl, page, reference },
  };
};
