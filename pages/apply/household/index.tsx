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
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import withApplication from '../../../lib/hoc/withApplication';
import { exit } from '../../../lib/store/auth';
import {
  selectApplicantsMemorised,
  selectMainApplicant,
} from 'lib/store/applicant';

const ApplicationHouseholdOverview = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const applicants = useAppSelector(selectApplicantsMemorised);
  const mainApplicant = useAppSelector(selectMainApplicant);

  const breadcrumbs = [
    {
      id: 'application-overview',
      href: '/apply/overview',
      name: 'Application',
    },
  ];

  const onDelete = () => {
    // TODO: delete application
    router.push('/');
    dispatch(exit());
  };

  return (
    <Layout
      pageName="My household"
      breadcrumbs={breadcrumbs}
      dataTestId="test-apply-household-page"
    >
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

      <ButtonLink
        href="/apply/household/add-person"
        secondary={true}
        dataTestId="test-apply-household-add-a-person-button"
      >
        Add a person
      </ButtonLink>
      <Paragraph>
        There {applicants.length > 1 ? 'are' : 'is'}
        <strong>
          {applicants.length > 1 ? ` ${applicants.length} people` : ' 1 person'}
        </strong>{' '}
        in this application.
      </Paragraph>
      <ButtonLink
        href="/apply/expect"
        dataTestId="test-apply-household-index-continue-to-next-step-button"
      >
        Continue to next step
      </ButtonLink>
      <DeleteLink
        content="Cancel this application"
        details="This application will be permanently deleted."
        onDelete={onDelete}
      />
    </Layout>
  );
};

export default withApplication(ApplicationHouseholdOverview);
