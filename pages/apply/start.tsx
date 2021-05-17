import { HeadingOne } from "../../components/content/headings"
import Layout from "../../components/layout/resident-layout"
import whenEligible from "../../lib/hoc/whenEligible"
import { Auth } from "aws-amplify"
import { useRouter } from "next/router"
import Form from "../../components/form/form"
import { FormData } from "../../lib/types/form"
import { getSignInDetailsFormData } from "../../lib/utils/form-data"
import { useStore } from "react-redux"
import { Store } from "../../lib/store"
import { createUser } from "../../lib/store/resident"

const ApplicationStartPage = (): JSX.Element => {
  const router = useRouter()
  const store = useStore<Store>()
  const resident = store.getState().resident

  if (resident.isLoggedIn) {
    router.push("/apply/overview")
  }

  const signUp = async (values: FormData) => {
    try {
      const { user } = await Auth.signUp({
        username: values.email,
        password: values.password,
        attributes: {
          given_name: values.first_name,
          family_name: values.last_name,
          phone_number: values.phone_number, // E.164 number convention
        }
      });

      // TODO: save user to store
      store.dispatch(createUser(values.email))
      router.push("/apply/verify")

    } catch (error) {
      // TODO: handle error
      console.log('error signing up:', error);
    }
  }

  return (
    <Layout>
      <HeadingOne content="Start your application" />
      <Form formData={getSignInDetailsFormData()} onSubmit={signUp} />
    </Layout>
  )
}

export default whenEligible(ApplicationStartPage)
