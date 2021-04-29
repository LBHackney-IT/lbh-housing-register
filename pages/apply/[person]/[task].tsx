import Form from "../../../components/form/form"
import Layout from '../../../components/layout/resident-layout'
import { getImmigrationStatusFormData } from "../../../lib/utils/form"
import { useRouter } from 'next/router'

export default function Apply(): JSX.Element {
  const formData = getImmigrationStatusFormData()
  const router = useRouter()
  const returnTo = router.asPath.substr(0, router.asPath.lastIndexOf("/"))
  
  const updateUsersImmigrationStatus = (values: {[key: string]: any}) => {
    console.info(values)
  }

  return (
    <Layout>
      <Form formData={formData} onSave={updateUsersImmigrationStatus} onSubmit={() => router.push(returnTo)} />
    </Layout>
  )
}