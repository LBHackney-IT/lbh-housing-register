import Button, { ButtonLink } from "../../components/button"
import { HeadingOne } from "../../components/content/headings"
import Paragraph from "../../components/content/paragraph"
import Hint from "../../components/form/hint"
import Layout from "../../components/layout/resident-layout"
import SummaryList, { SummaryListActions as Actions, SummaryListKey as Key, SummaryListRow as Row } from "../../components/summary-list"
import Tag from "../../components/tag"
import whenAgreed from "../../lib/hoc/whenAgreed"
import whenEligible from "../../lib/hoc/whenEligible"
import { Store } from "../../lib/store"
import { MAIN_RESIDENT_KEY } from "../../lib/utils/constants"
import { applicationStepsRemaining } from "../../lib/utils/resident"
import Link from "next/link"
import { useStore } from "react-redux"
import { useRouter } from "next/router"
import { updateApplication } from "../../lib/gateways/internal-api"

const ApplicationPersonsOverview = (): JSX.Element => {
  const router = useRouter();
  const store = useStore<Store>();
  const applicants = [
    store.getState().resident,
    ...store.getState().additionalResidents,
  ];

  const breadcrumbs = [
    {
      href: '/apply/overview',
      name: 'Application',
    },
  ];

  const handleSubmit = async (): Promise<void> => {
    try {
      const applicationId = applicants[0].applicationId
      const data = await updateApplication(applicants, applicationId)
      console.log(data)

    } catch (err) {
      console.log(err);
      // TODO: handle error
    }
    router.push('/apply/confirmation');
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <HeadingOne content="My household" />

      <SummaryList>
        {applicants.map((resident, index) => {
          const tasksRemaining = applicationStepsRemaining(resident);

          return (
            <Row key={index} verticalAlign="middle">
              <Key>
                <>
                  <Hint
                    content={
                      `Person ${index + 1}` +
                      (applicants.length > 1 &&
                      resident.slug == MAIN_RESIDENT_KEY
                        ? ' (you)'
                        : '')
                    }
                  />
                  <Link href={`/apply/${resident.slug}`}>{resident.name}</Link>
                </>
              </Key>
              <Actions>
                {resident.isEligible === false ? (
                  <Tag content="Not eligible" variant="red" />
                ) : tasksRemaining == 0 ? (
                  <Tag content="Completed" variant="green" />
                ) : (
                  <Tag
                    content={`${tasksRemaining} task${
                      tasksRemaining > 1 ? 's' : ''
                    } to do`}
                  />
                )}
              </Actions>
            </Row>
          );
        })}
      </SummaryList>

      <ButtonLink href="/apply/add-resident" secondary={true}>
        Add a person
      </ButtonLink>

      {applicants.every(
        (resident) => applicationStepsRemaining(resident) == 0
      ) && (
        <>
          <Paragraph>
            The button below only shows when all tasks are complete.
          </Paragraph>
          <Button onClick={handleSubmit}>Submit application</Button>
        </>
      )}
    </Layout>
  );
};

export default whenAgreed(whenEligible(ApplicationPersonsOverview));
