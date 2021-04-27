import Form from "../components/form"
import Layout from '../components/layout/resident-layout'
import FormsManager from "../lib/forms-manager"

export default function Apply(): JSX.Element {
  const formData = FormsManager.getQualificationFormData();

  return (
    <Layout>
      <Form formData={formData} onSubmit={(values) => console.log(values)} />
    </Layout>
  )
}