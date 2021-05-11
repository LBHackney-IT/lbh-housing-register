import Layout from "../components/layout/resident-layout"
import { HeadingOne } from "../components/content/headings"
import Paragraph from "../components/content/paragraph"

export default function AccessDeniedPage(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="Access denied ⛔" />
      <Paragraph>Make sure you have been assigned the relevant permissions within Hackney.</Paragraph>
    </Layout>
  )
}
