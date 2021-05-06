import ApplicationForms from "../../components/application/application-forms"
import Layout from "../../components/layout/resident-layout"
import { FormData } from "../../lib/types/form"
import { useRouter } from "next/router"

export default function EligibilityChecker(): JSX.Element {
  const baseHref = "/eligibility-checker"
  const router = useRouter()

  const steps: string[] = ["your-situation", "immigration-status"]
  const activeStep = router.query.step ? router.query.step[0] : steps[0]

  const onCompletion = (values: FormData) => {
    // TODO! values needs updating to include all forms
    console.log(values)
  }

  return (
    <Layout>
      <ApplicationForms
        activeStep={activeStep}
        baseHref={baseHref}
        onCompletion={onCompletion}
        steps={steps}
        />
    </Layout>
  )
}