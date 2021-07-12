import ApplicationForms from '../../components/application/application-forms';
import EligibilityOutcome from '../../components/eligibility';
import Layout from '../../components/layout/resident-layout';
import { Store } from '../../lib/store';
import { getEligibilitySteps } from '../../lib/utils/application-forms';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAppSelector } from '../../lib/store/hooks';

export default function EligibilityChecker(): JSX.Element {
  const applicant =
    useAppSelector((store) => store.application.mainApplicant) || {};

  const router = useRouter();
  const { step: [activeStep] = [] } = router.query as {
    step: string[] | undefined;
  };

  const baseHref = '/eligibility';

  const onCompletion = () => {
    router.push(`${baseHref}/outcome`);
  };

  return (
    <Layout>
      {activeStep === 'outcome' && <EligibilityOutcome />}
      {activeStep !== 'outcome' && (
        <ApplicationForms
          steps={getEligibilitySteps()}
          activeStep={activeStep}
          baseHref={baseHref}
          onCompletion={onCompletion}
          applicant={applicant}
        />
      )}
    </Layout>
  );
}
