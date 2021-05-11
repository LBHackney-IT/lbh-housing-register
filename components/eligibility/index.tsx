import Eligible from "./eligible"
import NotEligible from "./not-eligible"
import { Store } from "../../lib/store"
import { useStore } from "react-redux"

export default function EligibilityOutcome(): JSX.Element {
  const store = useStore<Store>()
  const isEligible = store.getState().user.isEligible

  return isEligible ? <Eligible /> : <NotEligible />
}