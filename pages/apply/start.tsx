import { HeadingOne } from "../../components/content/headings"
import Layout from "../../components/layout/resident-layout"
import whenEligible from "../../lib/hoc/whenEligible"
import { Auth } from "aws-amplify"
import { useRouter } from "next/router"
import Form from "../../components/form/form"
import { FormData } from "../../lib/types/form"
import { getFormData, SIGN_UP_DETAILS } from "../../lib/utils/form-data"
import { useStore } from "react-redux"
import { Store } from "../../lib/store"
import { createUser, startApplication } from "../../lib/store/resident"
import { createApplication } from "../../lib/gateways/internal-api"
import { APPLICATION_STATUS_IN_PROGRESS } from "../../lib/utils/constants"

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
        username: values.emailAddress,
        password: values.password,
        attributes: {
          given_name: values.firstName,
          family_name: values.surname,
          phone_number: values.phoneNumber, // E.164 number convention
        }
      });

      // TODO: save user to store, map personal details with form data
      store.dispatch(createUser(values))

      // TODO: create application for the new user, status 'In Progress'?
      const applicants = [store.getState().resident]
      const application = await createApplication(applicants, APPLICATION_STATUS_IN_PROGRESS)

      // TODO: use id from newly created application and save to store
      store.dispatch(startApplication(application.id))

      router.push("/apply/verify")

    } catch (error) {
      // TODO: handle error
      console.log('error signing up:', error);
    }
  }

  return (
    <Layout>
      <HeadingOne content="Start your application" />
      <Form formData={getFormData(SIGN_UP_DETAILS)} buttonText="Save and continue" onSubmit={signUp} />
    </Layout>
  )
}

export default whenEligible(ApplicationStartPage)
