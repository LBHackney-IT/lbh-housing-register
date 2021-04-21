import Layout from '../../components/layout/staff-layout';
import Button from "../../components/button"
import { HeadingOne } from "../../components/headings"
import Paragraph from "../../components/paragraph"
import ApplicationTable from "../../components/application-table"

export default function ApplicationList(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="Staff dashboard" />
      <Paragraph content="<strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Pellentesque mi ex, maximus tempus condimentum eget, volutpat eu nunc. Mauris tincidunt, neque quis viverra ultricies, tellus lacus fringilla tortor, at blandit purus diam et augue." />
      <ApplicationTable caption="Applications" />
    </Layout>
  )
}
