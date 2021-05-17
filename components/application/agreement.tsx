import { HeadingOne } from "../content/headings"
import Paragraph from "../content/paragraph"
import Form from "../form/form"
import { Store } from "../../lib/store"
import { agree } from "../../lib/store/resident"
import { FormData } from "../../lib/types/form"
import { getAgreementFormData } from "../../lib/utils/form-data"
import { useRouter } from "next/router"
import { useStore } from "react-redux"

export default function ApplicationAgreement() {
  const router = useRouter()
  const store = useStore<Store>()
  const resident = store.getState().resident

  const onSubmit = () => {
    router.push("/apply/start")
  }

  if (resident.hasAgreed) {
    onSubmit()
  }

  const agreementFormData = getAgreementFormData()
  const onSave = (values: FormData) => {
    store.dispatch(agree(values.agreement))
  }

  return (
    <>
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

      <Form buttonText="Save and continue" formData={agreementFormData} onSave={onSave} onSubmit={onSubmit} />
    </>
  )
}
