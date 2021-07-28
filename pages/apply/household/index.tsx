import { ButtonLink } from '../../../components/button';
import { HeadingOne } from '../../../components/content/headings';
import Paragraph from '../../../components/content/paragraph';
import Hint from '../../../components/form/hint';
import Layout from '../../../components/layout/resident-layout';
import SummaryList, {
  SummaryListKey as Key,
  SummaryListRow as Row,
} from '../../../components/summary-list';
import { Applicant } from '../../../domain/HousingApi';
import whenAgreed from '../../../lib/hoc/whenAgreed';
import { useAppSelector } from '../../../lib/store/hooks';

const ApplicationHouseholdOverview = (): JSX.Element => {

  const applicants = useAppSelector((store) =>
    [store.application.mainApplicant, store.application.otherMembers]
      .filter((v): v is Applicant | Applicant[] => v !== undefined)
      .flat()
  );

  const mainApplicant = useAppSelector(
    (store) => store.application.mainApplicant
  );

  const breadcrumbs = [
    {
      href: '/apply/overview',
      name: 'Application',
    },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <HeadingOne content="Who are you applying with?" />
      <Paragraph>
        Include all the people you would like to move with.
      </Paragraph>

      <SummaryList>
        {applicants.map((applicant, index) => {
          return (
            <Row key={index} verticalAlign="middle">
              <Key>
                <>
                  <Hint
                    content={
                      `Person ${index + 1}` +
                      (applicants.length > 1 && applicant === mainApplicant
                        ? ' (you)'
                        : '')
                    }
                  />
                  {applicant.person?.firstName} {applicant.person?.surname}
                </>
              </Key>
            </Row>
          );
        })}
      </SummaryList>

      <ButtonLink href="/apply/household/add-person" secondary={true}>
        Add a person
      </ButtonLink>
      <Paragraph>
        There {applicants.length > 1 ? "are" : "is"}
        <strong>{applicants.length > 1 ? ` ${applicants.length} people` : " 1 person"}</strong> in this application.
      </Paragraph>
      <ButtonLink href="/apply/overview">
        Continue to next step
      </ButtonLink>
    </Layout>
  );
};

export default whenAgreed(ApplicationHouseholdOverview);
