import Layout from '../../../components/layout/staff-layout';
import { GetServerSideProps } from 'next'
import { getApplication } from "../../../lib/gateways/applications-api"
import { Application } from '../../../domain/application';
import { HeadingOne } from "../../../components/headings"
import Paragraph from "../../../components/paragraph"
import PersonalDetails from "../../../components/applications/personal-details"

interface PageProps {
  data: Application
}

export default function ApplicationPage({ data }: PageProps): JSX.Element {
  return (
    <Layout>
      <HeadingOne content={`Application #${data.id}`} />
      <Paragraph content="<strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Pellentesque mi ex, maximus tempus condimentum eget, volutpat eu nunc. Mauris tincidunt, neque quis viverra ultricies, tellus lacus fringilla tortor, at blandit purus diam et augue." />

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <PersonalDetails heading="Personal details" applicant={data.applicant} />
        </div>
        <div className="govuk-grid-column-one-third">
        </div>
      </div>
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
