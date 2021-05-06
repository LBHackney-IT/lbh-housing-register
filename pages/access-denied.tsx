import Layout from '../components/layout/resident-layout';
import { HeadingOne } from "../components/headings"
import Paragraph from "../components/paragraph"

export default function AccessDeniedPage(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="Access denied ⛔" />
      <Paragraph content="Make sure you have been assigned the relevant permissions within Hackney." />
    </Layout>
  )
}
