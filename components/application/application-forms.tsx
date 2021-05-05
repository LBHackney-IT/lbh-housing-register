import Form from "../form/form"
import Paragraph from "../content/paragraph"
import { getFormData } from "../../lib/utils/form-data"
import { useRouter } from "next/router"

interface ApplicationFormsProps {
  activeStep?: string
  baseHref: string
  onCompletion: () => void
  steps: string[]
}

/**
 * Application form component is made up of multiple forms
 * The idea being that we can offer an overview of the application from this component,
 * as well as a clear journey from the first form to the next, and so on...
 * @param {ApplicationFormsProps} param0 - Property object of the application
 * @returns {JSX.Element}
 */
export default function ApplicationForms({ activeStep, baseHref, onCompletion, steps }: ApplicationFormsProps): JSX.Element {
  const router = useRouter()

  if (steps.includes(activeStep!)) {
    const next = () => {
      const index = steps.indexOf(activeStep!) + 1;
      if (index == steps.length) {
        onCompletion()
      }
      else {
        router.push(`${baseHref}/${steps[1]}`)
      }
    }

    const onSave = (values: {}) => {
      console.info(activeStep, values)
    }

    return (
      <>
        {steps.map((step, index) => {
          if (step == activeStep) {
            return <Form key={index} formData={getFormData(step)} onSave={onSave} onSubmit={next} />
          }
        })}
      </>
    )
  }
  else {
    return (
      <div>overview page</div>
    )
  }
}