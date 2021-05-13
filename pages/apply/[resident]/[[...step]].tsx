import ApplicationForms from "../../../components/application/application-forms"
import Layout from "../../../components/layout/resident-layout"
import whenEligible from "../../../lib/hoc/whenEligible"
import { IMMIGRATION_STATUS, PERSONAL_DETAILS } from "../../../lib/utils/form-data"
import { useRouter } from "next/router"

const ApplicationStep = (): JSX.Element => {
  const router = useRouter()
  let { resident, step } = router.query
  resident = resident as string

  const baseHref = `/apply/${resident}`
  const steps = [IMMIGRATION_STATUS, PERSONAL_DETAILS]
  const activeStep = step ? step[0] : undefined

  const breadcrumbs = [
    {
      href: "/apply/overview",
      name: "Application"
    },
    {
      href: baseHref,
      name: resident
    }
  ]

  const onCompletion = () => {
    router.push(baseHref)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <ApplicationForms
        activeStep={activeStep}
        baseHref={baseHref}
        onCompletion={onCompletion}
        steps={steps} />
    </Layout>
  )
}

export default whenEligible(ApplicationStep)