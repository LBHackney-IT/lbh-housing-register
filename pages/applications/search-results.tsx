import { GetServerSideProps } from 'next';

import ApplicationsTable from '../../components/admin/ApplicationsTable';
import SearchBox from '../../components/admin/SearchBox';
import Sidebar from '../../components/admin/sidebar';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/staff-layout';
import SimplePaginationSearch from '../../components/SimplePaginationSearch';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { PaginatedSearchResultsResponse } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import { searchAllApplications } from '../../lib/gateways/applications-api';
import {
  HackneyGoogleUserWithPermissions,
  canViewWorktray,
  getRedirect,
  getSession,
} from '../../lib/utils/googleAuth';

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
  return (
    // noting here the possibility of unecessary re-renders that will need some investigation.
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <UserContext.Provider value={{ user }}>
      <Layout pageName="My worktray">
        <SearchBox
          title="Housing Register"
          buttonTitle="Search"
          watermark="Search all applications (name, reference, bidding number)"
          dataTestId="test-search-box"
        />
        <div className="govuk-grid-row">
          {canViewWorktray(user as HackneyGoogleUserWithPermissions) && (
            <div className="govuk-grid-column-one-quarter">
              <Sidebar />
            </div>
          )}
          <div className="govuk-grid-column-three-quarters">
            <HeadingOne content="Results" />

            {applications && applications.totalResults !== 0 ? (
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
            ) : (
              <Paragraph>No applications to show</Paragraph>
            )}
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

  const { searchString = '', page = '', pageSize = '' } = context.query as {
    searchString: string;
    page: string;
    pageSize: string;
  };

  const applications = await searchAllApplications(
    searchString,
    page,
    pageSize
  );

  return {
    props: { user, applications, page, pageSize },
  };
};
