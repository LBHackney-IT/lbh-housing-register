import Form from '../../components/form/form'
import { HeadingOne } from '../../components/content/headings'
import Paragraph from "../../components/content/paragraph"
import Layout from '../../components/layout/resident-layout'
import { MultiPageFormData } from '../../lib/types/form'
import { useRouter } from 'next/router'

export default function Apply(): JSX.Element {
  const router = useRouter()
  const agreementFormData: MultiPageFormData = {
    steps: [
      {
        fields: [
          {
            as: "checkbox",
            initialValue: false,
            label: "I understand and accept",
            name: "agreement",
            validation: {
              required: true
            }
          }
        ]
      }
    ]
  }

  const onSave = (values: {[key: string]: any}) => {
    // TODO: Bypass step if user has already agreed
    console.log('agreement form', values)
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

      <Form formData={agreementFormData} onSubmit={onSubmit} />
    </Layout>
  )
}