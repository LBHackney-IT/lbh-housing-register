import { GetServerSideProps } from 'next';
import SearchBox from '../../components/admin/SearchBox';
import Sidebar from '../../components/admin/sidebar';
import { HeadingOne } from '../../components/content/headings';
import Layout from '../../components/layout/staff-layout';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { PaginatedSearchResultsResponse } from '../../domain/HousingApi';
import { UserContext } from '../../lib/contexts/user-context';
import { searchAllApplications } from '../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../lib/utils/googleAuth';
import ApplicationsTable from '../../components/admin/ApplicationsTable';
import SimplePaginationSearch from '../../components/SimplePaginationSearch';
import Paragraph from '../../components/content/paragraph';

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
    <UserContext.Provider value={{ user }}>
      <Layout pageName="My worktray">
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
            <HeadingOne content="Results" />
            <>
              {applications ? (
                <>
                  {applications.totalResults !== 0 ? (
                    <>
                      <ApplicationsTable
                        applications={applications}
                        showStatus={true}
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
                </>
              ) : null}
            </>
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
    searchString = '',
    page = '',
    pageSize = '',
  } = context.query as {
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
