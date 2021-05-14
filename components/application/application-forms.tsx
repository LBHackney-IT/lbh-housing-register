import { HeadingOne, HeadingTwo } from "../content/headings"
import Paragraph from "../content/paragraph"
import Form from "../form/form"
import { Store } from "../../lib/store"
import { ApplicationSteps } from "../../lib/types/application"
import { FormData } from "../../lib/types/form"
import { Resident } from "../../lib/types/resident"
import { getFormIdsFromApplicationSteps } from "../../lib/utils/application-forms"
import { getFormData } from "../../lib/utils/form-data"
import { hasResidentAnsweredForm, updateResidentsFormData } from "../../lib/utils/resident"
import SummaryList, { SummaryListActions, SummaryListRow, SummaryListValue } from "../summary-list"
import Tag from "../tag"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useStore } from "react-redux"

interface ApplicationFormsProps {
  activeStep?: string
  baseHref: string
  onCompletion: (values: FormData) => void
  resident: Resident
  steps: ApplicationSteps[]
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

  const formSteps = getFormIdsFromApplicationSteps(steps)

  if (formSteps.includes(activeStep!)) {
    const next = () => {
      const index = formSteps.indexOf(activeStep!) + 1;
      if (index < formSteps.length) {
        activeStep = formSteps[index]
        router.replace(`${baseHref}/${activeStep}`)
      }
    }

    const onSave = (values: FormData) => {
      const data: {[key: string]: FormData} = {...applicationData}
      data[activeStep!] = values

      setApplicationData(data)
      updateResidentsFormData(store, resident, data)

      const index = formSteps.indexOf(activeStep!) + 1;
      if (index == formSteps.length) {
        onCompletion(data)
      }
    }

    return (
      <>
        {formSteps.map((step, index) => {
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
        {steps.map((step, index) => (
          <div key={index}>
            <HeadingTwo content={step.heading} />
            <SummaryList>
              {step.steps.map((formStep, i) => (
                <SummaryListRow key={i}>
                  <SummaryListValue>
                    <Link href={`${baseHref}/${formStep.id}`}>
                      {formStep.heading}
                    </Link>
                  </SummaryListValue>
                  <SummaryListActions>
                    {hasResidentAnsweredForm(resident, formStep.id) ?
                      <Tag content="Check answers" /> :
                      <Tag content="Todo" variant="grey" />
                    }
                  </SummaryListActions>
                </SummaryListRow>
              ))}
            </SummaryList>
          </div>
        ))}
      </>
    )
  }
}