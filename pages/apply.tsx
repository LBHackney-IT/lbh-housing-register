import FormsManager from "../lib/forms-manager"
import { MultiPageForm } from "../components/form"

export default function Apply(): JSX.Element {
  const formData = FormsManager.getQualificationFormData();

  return (
    <MultiPageForm data={formData} />
  )
}


// TODO

// Sections
// - hide section unless active

// User data
// - save (automatically?)
// - get user's progress and pre-populate form

// Steps
// - go to steps when :step provided
// -- unless the user has not filled in enough information to be there (show message)
// - alternatively, work out where the user should be by progressing through steps

// /apply/reset (might be a dialog)
// - if user already started, confirm the user would like to start again or return to previous state?
// -- if yes, delete data
// -- redirect to /apply to start again

// Qualify?
// - on submit of step and successful validation, we need to check if user still qualifies before they see the next step
// -> Otherwise out we go, with some custom text