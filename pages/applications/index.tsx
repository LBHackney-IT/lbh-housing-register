import Layout from '../../components/layout/staff-layout';
import Stats from "../../components/stats"
import { HeadingOne } from "../../components/headings"
import ApplicationTable from "../../components/application-table"

export default function ApplicationList(): JSX.Element {

  // TODO: use real data
  const stats = [
    {
      'value': '12',
      'caption': 'New applications'
    },
    {
      'value': '3',
      'caption': 'Awaiting evidence'
    },
    {
      'value': '99',
      'caption': 'Problems'
    },
  ];

  return (
    <Layout>
      <HeadingOne content="Staff dashboard" />
      <Stats className="govuk-grid-column-one-third" stats={stats} />
      <ApplicationTable caption="Applications" />
    </Layout>
  )
}
