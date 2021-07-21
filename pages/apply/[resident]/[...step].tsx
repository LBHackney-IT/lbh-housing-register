import { useRouter } from 'next/router';
import ApplicationForms from '../../../components/application/application-forms';
import Hint from '../../../components/form/hint';
import Layout from '../../../components/layout/resident-layout';
import whenAgreed from '../../../lib/hoc/whenAgreed';
import { selectApplicant } from '../../../lib/store/application';
import { useAppSelector } from '../../../lib/store/hooks';
import { getApplicationStepFromId } from '../../../lib/utils/application-forms';
import { getApplicationStepsForResident } from '../../../lib/utils/resident';
import Custom404 from '../../404';

const ApplicationStep = (): JSX.Element => {
  const router = useRouter();
  const { resident, step } = router.query as { resident: string; step: string };

  const applicant = useAppSelector(selectApplicant(resident));
  const mainResident = useAppSelector((s) => s.application.mainApplicant);

  if (!applicant) {
    return <Custom404 />;
  }

  const activeStep = step ? step[0] : undefined;
  const baseHref = `/apply/${applicant.person?.id}`;
  const returnHref = '/apply/overview';

  const steps = getApplicationStepsForResident(applicant === mainResident);

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
    {
      href: baseHref,
      name: applicant.person?.firstName || '',
    },
    {
      href: `${baseHref}/${step}`,
      name: getApplicationStepFromId(step, steps)?.heading || '',
    },
  ];

  const onCompletion = async () => {
    router.push(baseHref);
  };

  const onExit = async () => {
    router.push(baseHref);
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Hint content={applicant.person?.firstName ?? ''} />
      <ApplicationForms
        applicant={applicant}
        steps={steps}
        activeStep={activeStep}
        baseHref={baseHref}
        onCompletion={onCompletion}
        onExit={onExit}
      />
    </Layout>
  );
};

export default whenAgreed(ApplicationStep);
