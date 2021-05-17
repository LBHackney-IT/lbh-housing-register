import ApplicationForms from "../../components/application/application-forms"
import EligibilityOutcome from "../../components/eligibility"
import Layout from "../../components/layout/resident-layout"
import { Store } from "../../lib/store"
import { getEligibilitySteps } from "../../lib/utils/application-forms"
import { useRouter } from "next/router"
import { useState } from "react"
import { useSelector } from "react-redux"

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
  const steps = getEligibilitySteps()
  const activeStep = router.query.step ? router.query.step[0] : steps[0].steps[0].id

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
        resident={resident}
        steps={steps}
        />
    </Layout>
  )
}