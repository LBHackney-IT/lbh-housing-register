import { HeadingOne } from "../content/headings"
import Paragraph from "../content/paragraph"
import Form from "../form/form"
import { Store } from "../../lib/store"
import { FormData } from "../../lib/types/form"
import { Resident } from "../../lib/types/resident"
import { getFormData } from "../../lib/utils/form-data"
import { updateResidentsFormData } from "../../lib/utils/resident"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useStore } from "react-redux"

interface ApplicationFormsProps {
  activeStep?: string
  baseHref: string
  onCompletion: (values: FormData) => void
  resident: Resident
  steps: string[]
}

/**
 * Application form component is made up of multiple forms
 * The idea being that we can offer an overview of the application from this component,
 * as well as a clear journey from the first form to the next, and so on...
 * @param {ApplicationFormsProps} param0 - Property object of the application
 * @returns {JSX.Element}
 */
export default function ApplicationForms({ activeStep, baseHref, onCompletion, resident, steps }: ApplicationFormsProps): JSX.Element {
  const router = useRouter()
  const store = useStore<Store>()
  const [applicationData, setApplicationData] = useState({})

  if (steps.includes(activeStep!)) {
    const next = () => {
      const index = steps.indexOf(activeStep!) + 1;
      if (index < steps.length) {
        activeStep = steps[index]
        router.replace(`${baseHref}/${activeStep}`)
      }
    }

    const onSave = (values: FormData) => {
      const data: {[key: string]: FormData} = {...applicationData}
      data[activeStep!] = values

      setApplicationData(data)
      updateResidentsFormData(store, resident, data)

      const index = steps.indexOf(activeStep!) + 1;
      if (index == steps.length) {
        onCompletion(data)
      }
    }

    return (
      <>
        {steps.map((step, index) => {
          if (step == activeStep) {
            const formData = getFormData(step)

            return (
              <div key={index}>
                {formData.heading && <HeadingOne content={formData.heading} />}
                {formData.copy && <Paragraph>{formData.copy}</Paragraph>}
                <Form buttonText="Save and continue" formData={formData} onSave={onSave} onSubmit={next} />
              </div>
            )
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