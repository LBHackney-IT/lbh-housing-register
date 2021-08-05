import { useRouter } from 'next/router';
import { ButtonLink } from '../../../components/button';
import { HeadingOne } from '../../../components/content/headings';
import Paragraph from '../../../components/content/paragraph';
import Hint from '../../../components/form/hint';
import DeleteLink from '../../../components/delete-link';
import Layout from '../../../components/layout/resident-layout';
import SummaryList, {
  SummaryListKey as Key,
  SummaryListRow as Row,
} from '../../../components/summary-list';
import { Applicant } from '../../../domain/HousingApi';
import whenAgreed from '../../../lib/hoc/whenAgreed';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { signOut } from '../../../lib/store/cognitoUser';

const ApplicationHouseholdOverview = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  const onDelete = () => {
    // TODO: delete application
    dispatch(signOut());
    router.push('/');
  };

  return (
    <Layout pageName="My household" breadcrumbs={breadcrumbs}>
      <HeadingOne content="Who are you applying with?" />
      <Paragraph>Include all the people you would like to move with.</Paragraph>

      <SummaryList>
        {applicants.map((applicant, index) => {
          return (
            <Row key={index} verticalAlign="middle">
              <Key>
                <>
                  <Hint
                    content={
                      `Person ${index + 1}` +
                      (applicant === mainApplicant
                        ? ': Me'
                        : `: My ${applicant.person?.relationshipType}`)
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
        There {applicants.length > 1 ? 'are' : 'is'}
        <strong>
          {applicants.length > 1 ? ` ${applicants.length} people` : ' 1 person'}
        </strong>{' '}
        in this application.
      </Paragraph>
      <ButtonLink href="/apply/expect">Continue to next step</ButtonLink>
      <DeleteLink
        content="Cancel this application"
        details="This application will be permanently deleted."
        onDelete={onDelete}
      />
    </Layout>
  );
};

export default whenAgreed(ApplicationHouseholdOverview);
