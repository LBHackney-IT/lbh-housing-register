import Form from "../../../components/form/form"
import Layout from '../../../components/layout/resident-layout'
import { getImmigrationStatusFormData } from "../../../lib/utils/form"
import { useRouter } from 'next/router'

export default function Apply(): JSX.Element {
  const formData = getImmigrationStatusFormData()
  const router = useRouter()

  let { person } = router.query
  person = person as string
  const returnTo = `/apply/${person}`

  const breadcrumbs = [
    {
      href: "/apply/overview",
      name: "Application"
    },
    {
      href: returnTo,
      name: person
    }
  ]
  
  const updateUsersImmigrationStatus = (values: {[key: string]: any}) => {
    console.info(values)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Form formData={formData} onSave={updateUsersImmigrationStatus} onSubmit={() => router.push(returnTo)} />
    </Layout>
  )
}