import { HeadingOne } from "../../components/content/headings"
import Layout from "../../components/layout/resident-layout"
import whenEligible from "../../lib/hoc/whenEligible"
import Paragraph from "../../components/content/paragraph"

const ApplicationVerifyPage = (): JSX.Element => {

  // TODO: verify and continue

  return (
    <Layout>
      <HeadingOne content="Sign in to continue" />
      <Paragraph>
        We've sent you a message to confirm your account.
      </Paragraph>
    </Layout>
  )
}

export default whenEligible(ApplicationVerifyPage)
