import { ButtonLink } from "../components/button"
import { HeadingOne, HeadingTwo } from "../components/content/headings"
import Layout from '../components/layout/resident-layout'
import Paragraph from "../components/content/paragraph"

export default function Home(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content={`Apply to the ${process.env.NEXT_PUBLIC_NAME!}`} />

      <HeadingTwo content="What to expect" />
      <Paragraph>
        It may take up to one hour to complete your application.
        You will need to supply personal details for each person in your application, and information about your current accommodation, income and any benefits received.
      </Paragraph>

      <HeadingTwo content="What you'll need to provide" />
      <Paragraph>
        You will need to upload proof of identity, address, income, savings, benefits for each person in your application.
      </Paragraph>

      <HeadingTwo content="What happens afterwards?" />
      <Paragraph>
        The information you provide will be verified with third parties.
        This will help us to assess you suitability for social housing in Hackney.
        If you application is successful, you may still wait many years until a housing offer is made.
      </Paragraph>

      <ButtonLink href="/apply">Start now</ButtonLink>
    </Layout>
  )
}
