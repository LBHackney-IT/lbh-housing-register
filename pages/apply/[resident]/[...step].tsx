import ApplicationForms from '../../../components/application/application-forms';
import Hint from '../../../components/form/hint';
import Layout from '../../../components/layout/resident-layout';
import whenAgreed from '../../../lib/hoc/whenAgreed';
import { getApplicationStepFromId } from '../../../lib/utils/application-forms';
import { getApplicationStepsForResident } from '../../../lib/utils/resident';
import { useRouter } from 'next/router';
import { useDispatch, useStore } from 'react-redux';
import Custom404 from '../../404';
import { useAppSelector } from '../../../lib/store/hooks';
import { selectApplicant } from '../../../lib/store/application';

const ApplicationStep = (): JSX.Element => {
  const router = useRouter();
  const { resident, step } = router.query as { resident: string; step: string };

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
    {
      href: `${baseHref}/${step}`,
      name: getApplicationStepFromId(step, steps)?.heading,
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
      <Hint content={currentResident.person?.firstName ?? ''} />
      <ApplicationForms
        steps={steps}
        activeStep={step}
        baseHref={baseHref}
        onCompletion={onCompletion}
        onExit={onExit}
      />
    </Layout>
  );
};

export default whenAgreed(ApplicationStep);
