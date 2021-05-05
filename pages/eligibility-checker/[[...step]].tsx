import ApplicationForms from "../../components/application/application-forms"
import Layout from "../../components/layout/resident-layout"
import { useRouter } from "next/router"

export default function EligibilityChecker(): JSX.Element {
  const baseHref = "/eligibility-checker"
  const router = useRouter()

  const steps: string[] = ["your-situation", "immigration-status"]
  const activeStep = router.query.step ? router.query.step[0] : steps[0]

  const onCompletion = () => {
    console.log("complete")
    // TODO! Work out if eligible
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