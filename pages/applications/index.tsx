import Layout from '../../components/layout/staff-layout';
import { GetServerSideProps } from 'next';
import { getApplications, getStats } from '../../lib/gateways/applications-api';
import { ApplicationList } from '../../domain/application';
import { Stat } from '../../domain/stat';
import { HeadingOne } from "../../components/headings"
import Paragraph from "../../components/paragraph"
import { Stats } from "../../components/stats"
import ApplicationTable from "../../components/applications/application-table"

interface PageProps {
  applications: ApplicationList
  stats: Array<Stat>
}

export default function ApplicationListPage({ applications, stats }: PageProps): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="Staff dashboard" />
      {stats && (
        <Stats className="govuk-grid-column-one-third" stats={stats} />
      )}
      {applications.results.length > 0
        ? <ApplicationTable caption="Applications" applications={applications} />
        : <Paragraph content="No applications to show" />
      }
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const applications = await getApplications()
  const stats = await getStats()

  return { props: { applications, stats } }
}
