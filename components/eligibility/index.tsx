import { useMemo } from 'react';
import { useAppSelector } from '../../lib/store/hooks';
import { checkEligible } from '../../lib/utils/form';
import Eligible from './eligible';
import NotEligible from './not-eligible';

export default function EligibilityOutcome(): JSX.Element {
  const mainApplicant = useAppSelector(
    (store) => store.application.mainApplicant
  );
  const isEligible = useMemo(
    () => mainApplicant && checkEligible(mainApplicant)[0],
    [mainApplicant]
  );
  return isEligible ? <Eligible /> : <NotEligible />;
}
