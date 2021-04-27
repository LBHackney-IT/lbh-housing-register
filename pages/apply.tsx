import Form from "../components/form/form"
import Layout from '../components/layout/resident-layout'
import { getQualificationFormData } from "../lib/utils/form"

export default function Apply(): JSX.Element {
  const formData = getQualificationFormData();

  return (
    <Layout>
      <Form formData={formData} onSubmit={(values) => console.log(values)} />
    </Layout>
  )
}