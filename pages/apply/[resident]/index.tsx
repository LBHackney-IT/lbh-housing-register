import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { HeadingOne, HeadingTwo } from '../../../components/content/headings';
import DeleteLink from '../../../components/delete-link';
import Hint from '../../../components/form/hint';
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
import {
  getApplicationSectionsForResident,
  hasResidentAnsweredForm,
} from '../../../lib/utils/resident';
import Custom404 from '../../404';
import { ButtonLink } from '../../../components/button';

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
    currentResident === mainResident
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

  return (
    <Layout pageName="Person overview" breadcrumbs={breadcrumbs}>
      <Hint content="Complete information for:" />
      <HeadingOne
        content={`${currentResident.person?.firstName} ${currentResident.person?.surname}`}
      />

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
                    <Tag content="Todo" />
                  )}
                </SummaryListActions>
              </SummaryListRow>
            ))}
          </SummaryList>
        </div>
      ))}

      <ButtonLink href={`/apply/${currentResident.person?.id}/summary/`}>Check Answers</ButtonLink>

      {currentResident !== mainResident && (
        <DeleteLink
          content="Delete this information"
          details="This information will be permanently deleted."
          onDelete={onDelete} />
      )}
    </Layout>
  );
};

export default whenAgreed(ApplicationStep);
