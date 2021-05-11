import Form from "../../components/form/form"
import { HeadingOne } from "../../components/content/headings"
import Paragraph from "../../components/content/paragraph"
import Layout from "../../components/layout/resident-layout"
import { FormData } from "../../lib/types/form"
import { getAgreementFormData } from '../../lib/utils/form-data'
import { useRouter } from 'next/router'

export default function Apply(): JSX.Element {
  // TODO! Check if eligible, before continuing

  const router = useRouter()
  const agreementFormData = getAgreementFormData()

  const onSave = (values: FormData) => {
    // TODO: Bypass step if user has already agreed
    console.info('agreement form', values)
  }

  const onSubmit = () => {
    router.push("/apply/overview")
  }
  
  return (
    <Layout>
      <HeadingOne content="Before you continue" />

      <Paragraph>
        I understand that the information I provide will be verified by Hackney Council to assess my level of housing need.
      </Paragraph>

      <Paragraph>
        The answers and evidence I provide may be referred to credit agencies, other local authorities, medical professionals and HMRC.
      </Paragraph>

      <Paragraph>
        I agree to allow a Housing Officer to conduct a home visit to assess my current living situation without advance notice.
        If I do not allow entry, my application may be declined.
      </Paragraph>

      <Form formData={agreementFormData} onSave={onSave} onSubmit={onSubmit} />
    </Layout>
  )
}