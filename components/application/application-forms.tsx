import Form from "../form/form"
import { updateFormData } from "../../lib/store/user"
import { getFormData } from "../../lib/utils/form-data"
import { FormData } from "../../lib/types/form"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useDispatch } from "react-redux"

interface ApplicationFormsProps {
  activeStep?: string
  baseHref: string
  onCompletion: (values: FormData) => void
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
  const dispatch = useDispatch()
  const router = useRouter()
  const [applicationData, setApplicationData] = useState({})

  if (steps.includes(activeStep!)) {
    const next = () => {
      const index = steps.indexOf(activeStep!) + 1;
      if (index < steps.length) {
        activeStep = steps[index]
        router.replace(`${baseHref}/${steps[index]}`)
      }
    }

    const onSave = (values: FormData) => {
      const data: {[key: string]: FormData} = {...applicationData}
      data[activeStep!] = values

      setApplicationData(data)
      dispatch(updateFormData(data))

      const index = steps.indexOf(activeStep!) + 1;
      if (index == steps.length) {
        onCompletion(data)
      }
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
      <>
        {steps.map((step, index) => {
          return (
            <div key={index}>
              <Link href={`${baseHref}/${step}`}>{step}</Link>
            </div>
          )
        })}
      </>
    )
  }
}