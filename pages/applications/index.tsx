import Layout from '../../components/layout/staff-layout';
import Stats from "../../components/stats"
import { HeadingOne } from "../../components/headings"
import ApplicationTable from "../../components/application-table"

// TODO: use real data
import { stats } from "../../data/stats"
import { applications } from "../../data/applications"

export default function ApplicationList(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="Staff dashboard" />
      <Stats className="govuk-grid-column-one-third" stats={stats} />
      <ApplicationTable caption="Applications" applications={applications} />
    </Layout>
  )
}
