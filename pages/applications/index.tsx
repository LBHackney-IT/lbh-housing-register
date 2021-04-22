import Layout from '../../components/layout/staff-layout';
import { GetServerSideProps } from 'next';
import { getApplications } from '../../lib/gateways/applications-api';
import { Application } from '../../domain/application';
import { HeadingOne } from "../../components/headings"
import Stats from "../../components/stats"
import ApplicationTable from "../../components/application-table"

// TODO: use real data
import { stats } from "../../data/stats"

interface PageProps {
  data: Array<Application>
}

export default function ApplicationList({ data }: PageProps): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="Staff dashboard" />
      <Stats className="govuk-grid-column-one-third" stats={stats} />
      <ApplicationTable caption="Applications" applications={data} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await getApplications()
  if (!data) {
    return {
      notFound: true,
    }
  }

  return { props: { data } }
}
