import Layout from "../../components/layout/resident-layout"
import whenEligible from "../../lib/hoc/whenEligible"
import ApplicationAgreement from "../../components/application/agreement"

const Apply = (): JSX.Element => {
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
    <Layout>
      <ApplicationAgreement />
    </Layout>
  )
}

export default whenEligible(Apply)
