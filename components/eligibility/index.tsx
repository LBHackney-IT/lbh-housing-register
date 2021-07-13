import Eligible from './eligible';
import NotEligible from './not-eligible';
import { Store } from '../../lib/store';
import { useStore } from 'react-redux';
import { useAppSelector } from '../../lib/store/hooks';
import { useMemo } from 'react';
import { checkEligible } from '../../lib/utils/form';

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
