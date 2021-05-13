import { ButtonLink } from "../../components/button"
import { HeadingOne } from "../../components/content/headings"
import Hint from "../../components/form/hint"
import Layout from "../../components/layout/resident-layout"
import SummaryList, { SummaryListActions as Actions, SummaryListKey as Key, SummaryListRow as Row } from "../../components/summary-list"
import Tag from "../../components/tag"
import whenEligible from "../../lib/hoc/whenEligible"
import { Store } from "../../lib/store"
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
        {users.map((user, index) => (
          <Row key={index} verticalAlign="middle">
            <Key>
              <>
                <Hint content={`Person ${index + 1}`} />
                <Link href={`/apply/${user.slug}`}>{user.name}</Link>
              </>
            </Key>
            <Actions>
              <Tag content="X tasks to do" />
            </Actions>
          </Row>
        ))}
      </SummaryList>

      <ButtonLink href="/apply/add-resident" secondary={true}>
        Add a person
      </ButtonLink>
    </Layout>
  )
}

export default whenEligible(ApplicationPersonsOverview)

// TODO!
// (You) on Person X
// Work out how many steps are required

// Add additional user