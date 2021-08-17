import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { HeadingTwo } from '../../../components/content/headings';
import DeleteLink from '../../../components/delete-link';
import Layout from '../../../components/layout/resident-layout';
import SummaryList, {
  SummaryListActions,
  SummaryListRow,
  SummaryListValue,
} from '../../../components/summary-list';
import Tag from '../../../components/tag';
import whenAgreed from '../../../lib/hoc/whenAgreed';
import {
  getQuestionValue,
  selectApplicant,
} from '../../../lib/store/applicant';
import { useAppSelector } from '../../../lib/store/hooks';
import { deleteApplicant } from '../../../lib/store/otherMembers';
import { getApplicationSectionsForResident } from '../../../lib/utils/resident';
import Custom404 from '../../404';
import Button, { ButtonLink } from '../../../components/button';
import { isOver18 } from '../../../lib/utils/dateOfBirth';

const ApplicationStep = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { resident } = router.query as { resident: string };

  const currentResident = useAppSelector(selectApplicant(resident));
  const mainResident = useAppSelector((s) => s.application.mainApplicant);

  if (!currentResident) {
    return <Custom404 />;
  }

  const baseHref = `/apply/${currentResident.person?.id}`;
  const returnHref = '/apply/overview';

  const steps = getApplicationSectionsForResident(
    currentResident === mainResident,
    isOver18(currentResident)
  );

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
    {
      href: baseHref,
      name: currentResident.person?.firstName || '',
    },
  ];

  const onDelete = () => {
    dispatch(deleteApplicant(currentResident));
    router.push(returnHref);
  };

  const goBack = () => {
    router.push('/apply/overview');
  };

  return (
    <Layout pageName="Person overview" breadcrumbs={breadcrumbs}>
      <h1 className="lbh-heading-h1" style={{ marginBottom: '40px' }}>
        <span className="govuk-hint lbh-hint">Complete information for:</span>
        {`${currentResident.person?.firstName} ${currentResident.person?.surname}`}
      </h1>

      {steps.map((step, index) => (
        <div key={index}>
          <HeadingTwo content={step.heading} />
          <SummaryList>
            {step.sections.map((formStep, i) => (
              <SummaryListRow key={i}>
                <SummaryListValue>
                  <Link href={`${baseHref}/${formStep.id}`}>
                    {formStep.heading}
                  </Link>
                </SummaryListValue>
                <SummaryListActions>
                  {getQuestionValue(
                    currentResident.questions,
                    formStep.id,
                    'sectionCompleted',
                    false
                  ) ? (
                    <Tag content="Completed" variant="green" />
                  ) : (
                    <Tag content="To do" />
                  )}
                </SummaryListActions>
              </SummaryListRow>
            ))}
          </SummaryList>
        </div>
      ))}
      <ButtonLink href={`/apply/${currentResident.person?.id}/summary/`}>
        Check answers
      </ButtonLink>
      <br />
      <Button onClick={goBack} secondary={true}>
        Save and go back
      </Button>
      {currentResident !== mainResident && (
        <DeleteLink
          content="Delete this information"
          details="This information will be permanently deleted."
          onDelete={onDelete}
        />
      )}
    </Layout>
  );
};

export default whenAgreed(ApplicationStep);
