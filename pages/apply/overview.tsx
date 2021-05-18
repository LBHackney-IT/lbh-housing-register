import { ButtonLink } from "../../components/button"
import { HeadingOne } from "../../components/content/headings"
import Hint from "../../components/form/hint"
import Layout from "../../components/layout/resident-layout"
import SummaryList, { SummaryListActions as Actions, SummaryListKey as Key, SummaryListRow as Row } from "../../components/summary-list"
import Tag from "../../components/tag"
import whenAgreed from "../../lib/hoc/whenAgreed"
import whenEligible from "../../lib/hoc/whenEligible"
import { Store } from "../../lib/store"
import { MAIN_RESIDENT_KEY } from "../../lib/store/resident"
import { applicationStepsRemaining } from "../../lib/utils/resident"
import Link from "next/link"
import { useStore } from "react-redux"

const ApplicationPersonsOverview = (): JSX.Element => {
  const store = useStore<Store>()
  const users = [store.getState().resident, ...store.getState().additionalResidents]

  const breadcrumbs = [
    {
      href: "/apply/overview",
      name: "Application"
    }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <HeadingOne content="People in this application" />

      <SummaryList>
        {users.map((user, index) => {
          const tasksRemaining = applicationStepsRemaining(user)

          return (
            <Row key={index} verticalAlign="middle">
              <Key>
                <>
                  <Hint content={`Person ${index + 1}` + (users.length > 1 && user.slug == MAIN_RESIDENT_KEY ? " (you)" : "")} />
                  <Link href={`/apply/${user.slug}`}>{user.name}</Link>
                </>
              </Key>
              <Actions>
                {user.isEligible === false ? <Tag content="Not eligible" variant="red" /> : (
                  tasksRemaining == 0 ?
                    <Tag content="Completed" variant="green" /> :
                    <Tag content={`${tasksRemaining} task${(tasksRemaining > 1 ? "s" : "")} to do`} />
                )}
              </Actions>
            </Row>
          )
        })}
      </SummaryList>

      <ButtonLink href="/apply/add-resident" secondary={true}>
        Add a person
      </ButtonLink>
    </Layout>
  )
}

export default whenAgreed(whenEligible(ApplicationPersonsOverview))
