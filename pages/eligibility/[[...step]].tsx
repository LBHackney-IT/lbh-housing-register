import { useRouter } from 'next/router';
import ApplicationForms from '../../components/application/application-forms';
import EligibilityOutcome from '../../components/eligibility';
import Layout from '../../components/layout/resident-layout';
import { useAppSelector } from '../../lib/store/hooks';
import { getEligibilitySteps } from '../../lib/utils/application-forms';

export default function EligibilityChecker(): JSX.Element {
  const applicant =
    useAppSelector((store) => store.application.mainApplicant) || {};

  const router = useRouter();
  const { step: [activeStep] = [] } = router.query as {
    step: string[] | undefined;
  };

  const baseHref = '/eligibility';

  const onSubmit = () => {
    router.push(`${baseHref}/outcome`);
  };

  return (
    <Layout>
      {activeStep === 'outcome' && <EligibilityOutcome />}
      {activeStep !== 'outcome' && (
        <ApplicationForms
          applicant={applicant}
          steps={getEligibilitySteps()}
          activeStep={activeStep}
          onSubmit={onSubmit}
        />
      )}
    </Layout>
  );
}
