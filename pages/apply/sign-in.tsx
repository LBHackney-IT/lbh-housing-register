import { HeadingOne } from "../../components/content/headings"
import Layout from "../../components/layout/resident-layout"
import whenEligible from "../../lib/hoc/whenEligible"
import { Auth } from "aws-amplify"
import { useRouter } from "next/router"
import Form from "../../components/form/form"
import { FormData } from "../../lib/types/form"
import { getSignInFormData } from "../../lib/utils/form-data"
import { useStore } from "react-redux"
import { Store } from "../../lib/store"
import { logIn } from "../../lib/store/resident"

const ApplicationSignInPage = (): JSX.Element => {
  const router = useRouter()
  const store = useStore<Store>()
  const resident = store.getState().resident

  if (resident.isLoggedIn) {
    router.push("/apply/overview")
  }

  const signIn = async (values: FormData) => {
    try {
      await Auth.signIn(values.email, values.password)
      store.dispatch(logIn(values.email))

      // TODO: verify code sent via email (2FA)
      //router.push("/apply/verify")

    } catch (error) {
      // TODO: handle error
      console.log('error signing in:', error);
    }
  }

  return (
    <Layout>
      <HeadingOne content="Sign in to your application" />
      <Form formData={getSignInFormData()} buttonText="Continue" onSubmit={signIn} />
    </Layout>
  )
}

export default whenEligible(ApplicationSignInPage)
