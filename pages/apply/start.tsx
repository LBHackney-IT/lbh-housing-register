import { HeadingOne } from "../../components/content/headings"
import Layout from "../../components/layout/resident-layout"
import whenEligible from "../../lib/hoc/whenEligible"
import { Auth } from "aws-amplify"
import { useRouter } from "next/router"
import Form from "../../components/form/form"
import { FormData } from "../../lib/types/form"
import { getSignInDetailsFormData } from "../../lib/utils/form-data"

const ApplicationStartPage = (): JSX.Element => {
  const router = useRouter()

  const signUp = async (values: FormData) => {
    try {
      const { user } = await Auth.signUp({
        username: values.username,
        password: values.password,
        attributes: {
          email: values.email,
          phone_number: values.phone_number, // E.164 number convention
        }
      });
      console.log(user);

      // TODO: save user to store
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
