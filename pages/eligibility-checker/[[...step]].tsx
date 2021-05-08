import ApplicationForms from "../../components/application/application-forms"
import EligibilityOutcome from "../../components/eligibility"
import Layout from "../../components/layout/resident-layout"
import { Store } from "../../lib/store"
import { updateEligibility } from "../../lib/store/user"
import { FormData } from "../../lib/types/form"
import { isEligible as checkEligibility } from "../../lib/utils/form"
import { useRouter } from "next/router"
import { useState } from "react"
import { useDispatch, useStore } from "react-redux"

export default function EligibilityChecker(): JSX.Element {
  const dispatch = useDispatch()
  const store = useStore<Store>()
  const [isEligible, setEligibility] = useState(store.getState().user.isEligible)

  const baseHref = "/eligibility-checker"

  if (isEligible !== undefined) {
    return (
      <Layout>
        <EligibilityOutcome />
      </Layout>
    )
  }
  else {
    const router = useRouter()
    const steps: string[] = ["your-situation", "immigration-status"]
    const activeStep = router.query.step ? router.query.step[0] : steps[0]

    const onCompletion = (values: {[key: string]: FormData}) => {
      const eligibility = checkEligibility(values)
      dispatch(updateEligibility(eligibility))
      setEligibility(eligibility[0])
      router.push(`${baseHref}/outcome`)
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
}