import { GetServerSideProps } from 'next';
import ApplicationTable from '../../components/applications/application-table';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/staff-layout';
import { Stats } from '../../components/stats';
import { ApplicationList } from '../../domain/application';
import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';
import { Stat } from '../../domain/Stat';
import { UserContext } from '../../lib/contexts/user-context';
import { getApplications, getStats } from '../../lib/gateways/applications-api';
import { getRedirect, getSession } from '../../lib/utils/auth';

interface PageProps {
  user: HackneyGoogleUser;
  applications: ApplicationList;
  stats: Array<Stat>;
}

export default function ApplicationListPage({
  user,
  applications,
  stats,
}: PageProps): JSX.Element {
  return (
    <UserContext.Provider value={{ user }}>
      <Layout>
        <HeadingOne content="Staff dashboard" />
        {stats && (
          <Stats className="govuk-grid-column-one-third" stats={stats} />
        )}
        {applications.results.length > 0 ? (
          <ApplicationTable
            caption="Applications"
            applications={applications}
          />
        ) : (
          <Paragraph>No applications to show</Paragraph>
        )}
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

  const applications = await getApplications();
  const stats = await getStats();

  return { props: { user, applications, stats } };
};
