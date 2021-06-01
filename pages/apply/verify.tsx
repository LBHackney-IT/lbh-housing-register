import { HeadingOne } from "../../components/content/headings"
import Layout from "../../components/layout/resident-layout"
import whenEligible from "../../lib/hoc/whenEligible"
import Paragraph from "../../components/content/paragraph"
import { Auth } from 'aws-amplify';
import Form from "../../components/form/form"
import Button from "../../components/button"
import { FormData } from "../../lib/types/form"
import { getFormData, SIGN_IN_VERIFY } from "../../lib/utils/form-data"
import { useRouter } from "next/router";
import { Store } from "../../lib/store";
import { useStore } from "react-redux";
import { logIn } from "../../lib/store/resident";

const ApplicationVerifyPage = (): JSX.Element => {
  const router = useRouter()
  const store = useStore<Store>()
  const resident = store.getState().resident

  if (resident.isLoggedIn) {
    router.push("/apply/overview")
  }

  const providedUsername: FormData = {
    "email": resident.username
  }

  const confirmSignUp = async (values: FormData) => {
    try {
      await Auth.confirmSignUp(values.emailAddress, values.code)

      // TODO: turns out we also need to sign in at this point!
      await Auth.signIn(values.emailAddress, "Testing123!")

      // TODO: update store
      store.dispatch(logIn(values.emailAddress))
      router.push("/apply/overview")

    } catch (error) {
      console.log('error confirming sign up', error)
    }
  }

  const resendCode = async (username: string) => {
    try {
      await Auth.resendSignUp(username)

      // TODO: provide UI update
    } catch (error) {
      // TODO: handle error
      console.log('error sending code', error)
    }
  }

  return (
    <Layout>
      <HeadingOne content="Enter your verification code" />
      {resident.username &&
        <>
          <Paragraph>
            We've sent a code to <strong>{resident.username}</strong> to confirm your account. Enter it below.
          </Paragraph>
          <Button onClick={() => resendCode(resident.username)} secondary>
            Send again
          </Button>
        </>
      }

      <Form formData={getFormData(SIGN_IN_VERIFY)} residentsPreviousAnswers={providedUsername} buttonText="Continue" onSubmit={confirmSignUp} />
    </Layout>
  )
}

export default whenEligible(ApplicationVerifyPage)
