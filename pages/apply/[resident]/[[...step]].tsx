import ApplicationForms from "../../../components/application/application-forms"
import { HeadingOne } from "../../../components/content/headings"
import Hint from "../../../components/form/hint"
import Layout from "../../../components/layout/resident-layout"
import whenEligible from "../../../lib/hoc/whenEligible"
import { Store } from "../../../lib/store"
import { deleteResident } from "../../../lib/store/additionalResidents"
import { getApplicationStepFromId } from "../../../lib/utils/application-forms"
import { getApplicationStepsForResident, getResident, isMainResident } from "../../../lib/utils/resident"
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

  const activeStep = step ? step[0] : undefined
  const baseHref = `/apply/${currentResident.slug}`
  const returnHref = "/apply/overview"
  const steps = getApplicationStepsForResident(currentResident)

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

  if (activeStep) {
    const applicationStep = getApplicationStepFromId(activeStep, steps)
    if (applicationStep) {
      breadcrumbs.push({
        href: `${baseHref}/${applicationStep.id}`,
        name: applicationStep.heading
      })
    }
  }


  const onCompletion = () => {
    router.push(baseHref)
  }

  const onDelete = () => {
    store.dispatch(deleteResident(currentResident))
    router.push(returnHref)
  }

  const onExit = () => {
    router.push(baseHref)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      {!activeStep ? (
        <>
          <Hint content="Complete information for:" />
          <HeadingOne content={currentResident.name} />
        </>
      ) : 
        <Hint content={currentResident.name} />
      }

      <ApplicationForms
        activeStep={activeStep}
        baseHref={baseHref}
        onCompletion={onCompletion}
        onExit={onExit}
        resident={currentResident!}
        steps={steps} />
      
      {!activeStep && !isMainResident(currentResident) && (
        <DeleteLink content="Delete this information" onDelete={onDelete} />
      )}
    </Layout>
  )
}

export default whenEligible(ApplicationStep)