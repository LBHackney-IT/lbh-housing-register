import ApplicationForms from "../../../components/application/application-forms"
import Layout from "../../../components/layout/resident-layout"
import whenEligible from "../../../lib/hoc/whenEligible"
import { Store } from "../../../lib/store"
import { IMMIGRATION_STATUS, PERSONAL_DETAILS } from "../../../lib/utils/form-data"
import { getResident } from "../../../lib/utils/resident"
import { useRouter } from "next/router"
import { useStore } from "react-redux"
import Custom404 from "../../404"

const ApplicationStep = (): JSX.Element => {
  const router = useRouter()
  const store = useStore<Store>()

  let { resident, step } = router.query
  resident = resident as string

  const currentResident = getResident(resident, store.getState())

  if (!currentResident) {
    return <Custom404 />
  }

  const baseHref = `/apply/${currentResident.slug}`
  const steps = [IMMIGRATION_STATUS, PERSONAL_DETAILS]
  const activeStep = step ? step[0] : undefined

  const breadcrumbs = [
    {
      href: "/apply/overview",
      name: "Application"
    },
    {
      href: baseHref,
      name: currentResident.name
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
        resident={currentResident!}
        steps={steps} />
    </Layout>
  )
}

export default whenEligible(ApplicationStep)