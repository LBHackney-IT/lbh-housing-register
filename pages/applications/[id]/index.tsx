import Layout from '../../../components/layout/staff-layout';
import { GetServerSideProps } from 'next'
import { getApplication } from "../../../lib/gateways/applications-api"
import { Application } from '../../../domain/application';
import { HeadingOne } from "../../../components/headings"
import Paragraph from "../../../components/paragraph"

interface PageProps {
  data: Application
}

export default function ApplicationPage({ data }: PageProps): JSX.Element {
  return (
    <Layout>
      <HeadingOne content={`Application Details - #${data.id}`} />
      <Paragraph content="<strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Pellentesque mi ex, maximus tempus condimentum eget, volutpat eu nunc. Mauris tincidunt, neque quis viverra ultricies, tellus lacus fringilla tortor, at blandit purus diam et augue." />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as {
    id: string;
  };

  const data = await getApplication(id)
  if (!data) {
    return {
      notFound: true,
    }
  }

  return { props: { data } }
}
