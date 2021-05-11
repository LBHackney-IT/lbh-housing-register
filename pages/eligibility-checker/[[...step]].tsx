import ApplicationForms from "../../components/application/application-forms"
import Layout from "../../components/layout/resident-layout"
import { Store } from "../../lib/store"
import { useRouter } from "next/router"
import { useState } from "react"
import { useSelector } from "react-redux"
import EligibilityOutcome from "../../components/eligibility"

export default function EligibilityChecker(): JSX.Element {
  let { resident } = useSelector<Store, Store>(state => state)
  const [isComplete, complete] = useState(resident.isEligible)

  if (isComplete) {
    return (
      <Layout>
        <EligibilityOutcome />
      </Layout>
    )
  }

  const baseHref = "/eligibility-checker"
  const router = useRouter()
  const steps: string[] = ["your-situation", "immigration-status"]
  const activeStep = router.query.step ? router.query.step[0] : steps[0]

  const onCompletion = () => {
    router.push(`${baseHref}/outcome`)
    complete(true)
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