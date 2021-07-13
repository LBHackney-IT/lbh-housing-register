import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { HeadingOne, HeadingTwo } from '../../../components/content/headings';
import DeleteLink from '../../../components/delete-link';
import Layout from '../../../components/layout/resident-layout';
import SummaryList, {
    SummaryListActions,
    SummaryListRow,
    SummaryListValue
} from '../../../components/summary-list';
import Tag from '../../../components/tag';
import whenAgreed from '../../../lib/hoc/whenAgreed';
import { selectApplicant } from '../../../lib/store/application';
import { useAppSelector } from '../../../lib/store/hooks';
import { deleteApplicant } from '../../../lib/store/otherMembers';
import {
    getApplicationStepsForResident,
    hasResidentAnsweredForm
} from '../../../lib/utils/resident';
import Custom404 from '../../404';

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

  const steps = getApplicationStepsForResident(
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
    <Layout breadcrumbs={breadcrumbs}>
      <HeadingOne
        content={`${currentResident.person?.firstName} ${currentResident.person?.surname}`}
      />

      {steps.map((step, index) => (
        <div key={index}>
          <HeadingTwo content={step.heading} />
          <SummaryList>
            {step.steps.map((formStep, i) => (
              <SummaryListRow key={i}>
                <SummaryListValue>
                  <Link href={`${baseHref}/${formStep.id}`}>
                    {formStep.heading}
                  </Link>
                </SummaryListValue>
                <SummaryListActions>
                  {hasResidentAnsweredForm(currentResident, formStep.id) ? (
                    <Tag content="Check answers" />
                  ) : (
                    <Tag content="Todo" variant="grey" />
                  )}
                </SummaryListActions>
              </SummaryListRow>
            ))}
          </SummaryList>
        </div>
      ))}

      {currentResident !== mainResident && (
        <DeleteLink content="Delete this information" onDelete={onDelete} />
      )}
    </Layout>
  );
};

export default whenAgreed(ApplicationStep);
