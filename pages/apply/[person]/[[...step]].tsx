import ApplicationForms from "../../../components/application/application-forms"
import Layout from "../../../components/layout/resident-layout"
import { useRouter } from 'next/router'

export default function ApplicationStep(): JSX.Element {
  const router = useRouter()
  let { person, step } = router.query
  person = person as string

  const baseHref = `/apply/${person}`
  const steps: string[] = ["test-data", "immigration-status"]
  const activeStep = step ? step[0] : undefined

  const breadcrumbs = [
    {
      href: "/apply/overview",
      name: "Application"
    },
    {
      href: baseHref,
      name: person
    }
  ]

  const onCompletion = () => {
    router.push(baseHref)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <ApplicationForms
        activeStep={activeStep}
        baseHref={baseHref}
        onCompletion={onCompletion}
        steps={steps} />
    </Layout>
  )
}