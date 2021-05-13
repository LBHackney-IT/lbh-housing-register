import ApplicationForms from "../../../components/application/application-forms"
import Layout from "../../../components/layout/resident-layout"
import whenEligible from "../../../lib/hoc/whenEligible"
import { Store } from "../../../lib/store"
import { deleteResident } from "../../../lib/store/additionalResidents"
import { IMMIGRATION_STATUS, PERSONAL_DETAILS } from "../../../lib/utils/form-data"
import { getResident, isMainResident } from "../../../lib/utils/resident"
import { useRouter } from "next/router"
import { useStore } from "react-redux"
import Custom404 from "../../404"
import DeleteLink from "../../../components/delete-link"

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
  const returnHref = "/apply/overview"
  const steps = [IMMIGRATION_STATUS, PERSONAL_DETAILS]
  const activeStep = step ? step[0] : undefined

  const breadcrumbs = [
    {
      href: returnHref,
      name: "Application"
    },
    {
      href: baseHref,
      name: currentResident.name
    }
  ]

  const onDelete = () => {
    store.dispatch(deleteResident(currentResident))
    router.push(returnHref)
  }

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
      
      {!activeStep && !isMainResident(currentResident) && (
        <DeleteLink content="Delete this information" onDelete={onDelete} />
      )}
    </Layout>
  )
}

export default whenEligible(ApplicationStep)