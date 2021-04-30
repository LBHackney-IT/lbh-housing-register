import Custom404 from "../404"
import Form from "../../components/form/form"
import Layout from '../../components/layout/resident-layout'
import { getFormData } from "../../lib/utils/form-data"
import { useRouter } from "next/router"

export default function EligibilityChecker(): JSX.Element {
  const baseUrl = "/eligibility-checker"
  const returnHref = "/apply"
  const router = useRouter()
  const steps: string[] = ["your-situation", "immigration-status"]
  const currentStep = router.query.step ? router.query.step[0] : steps[0]

  if (steps.includes(currentStep)) {
    const next = () => {
      const index = steps.indexOf(currentStep) + 1;
      if (index == steps.length) {
        router.push(returnHref)
      }
      else {
        router.push(`${baseUrl}/${steps[1]}`)
      }
    }

    const updateUserData = (values: {[key: string]: any}) => {
      console.info(values)
    }

    return (
      <Layout>
        {steps.map((step, index) => {
          if (step == currentStep) {
            return <Form key={index} formData={getFormData(step)} onSave={updateUserData} onSubmit={next} />
          }
        })}
      </Layout>
    )
  }
  else {
    return <Custom404 />
  }
}