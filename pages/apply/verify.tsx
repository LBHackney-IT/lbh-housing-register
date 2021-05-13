import { HeadingOne } from "../../components/content/headings"
import Layout from "../../components/layout/resident-layout"
import whenEligible from "../../lib/hoc/whenEligible"
import Paragraph from "../../components/content/paragraph"
import { Auth } from 'aws-amplify';
import Form from "../../components/form/form"
import Button from "../../components/button"
import { FormData } from "../../lib/types/form"
import { getSignInVerifyFormData } from "../../lib/utils/form-data"
import { useRouter } from "next/router";

const ApplicationVerifyPage = (): JSX.Element => {
  const router = useRouter()

  const confirmSignUp = async (values: FormData) => {
    try {
      await Auth.confirmSignUp(values.username, values.code)

      // TODO: turns out we also need to sign in at this point!
      let signin = await Auth.signIn(values.username, "Testing123!")
      console.log(signin)

      // TODO: update store
      //router.push("/apply/overview")

    } catch (error) {
      console.log('error confirming sign up', error)
    }
  }

  const resendCode = async () => {
    try {
      let response = await Auth.resendSignUp('testing');
      console.log(response)

    } catch (error) {
      console.log('error sending code', error)
    }
  }

  return (
    <Layout>
      <HeadingOne content="Sign in to continue" />
      <Paragraph>
        We've sent a code to <strong>placeholder@email.com</strong> to confirm your account. Enter it below.
      </Paragraph>
      <Button onClick={resendCode} secondary>
        Send again
      </Button>
      <Form formData={getSignInVerifyFormData()} onSubmit={confirmSignUp} />
    </Layout>
  )
}

export default whenEligible(ApplicationVerifyPage)
