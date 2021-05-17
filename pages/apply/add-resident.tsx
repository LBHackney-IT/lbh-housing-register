import { HeadingOne } from "../../components/content/headings"
import Form from "../../components/form/form"
import Layout from "../../components/layout/resident-layout"
import whenEligible from "../../lib/hoc/whenEligible"
import { Store } from "../../lib/store"
import { addResidentFromFormData } from "../../lib/store/additionalResidents"
import { FormData } from "../../lib/types/form"
import { getPersonalDetailsFormData } from "../../lib/utils/form-data"
import { useStore } from "react-redux"
import { useRouter } from "next/router"

const AddPersonToApplication = (): JSX.Element => {
  const returnHref = "/apply/overview"
  const router = useRouter()
  const store = useStore<Store>()

  const breadcrumbs = [
    {
      href: returnHref,
      name: "Application"
    }
  ]

  const onSubmit = (values: FormData) => {
    store.dispatch(addResidentFromFormData(values))
    router.push(returnHref)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <HeadingOne content="Add a person" />
      <Form buttonText="Add person" formData={getPersonalDetailsFormData()} onSubmit={onSubmit} />
    </Layout>
  )
}

export default whenEligible(AddPersonToApplication)