import Form from "../../../components/form/form"
import Layout from '../../../components/layout/resident-layout'
import { getFormData } from "../../../lib/utils/form-data"
import { useRouter } from 'next/router'

export default function Step(): JSX.Element {
  const formData = getFormData('test')
  const router = useRouter()

  let { person } = router.query
  person = person as string
  const returnHref = `/apply/${person}`

  const breadcrumbs = [
    {
      href: "/apply/overview",
      name: "Application"
    },
    {
      href: returnHref,
      name: person
    }
  ]
  
  const updateUsersImmigrationStatus = (values: {[key: string]: any}) => {
    console.info(values)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Form formData={formData} onSave={updateUsersImmigrationStatus} onSubmit={() => router.push(returnHref)} />
    </Layout>
  )
}