import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { exit } from '../store/auth';
import { ApplicationStatus } from '../../lib/types/application-status';

export default function withApplication<P>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: P) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const application = useAppSelector((store) => store.application);

    if (!application) {
      router.push('/');
      dispatch(exit());
    }

    useEffect(() => {
      if (application.status === ApplicationStatus.DISQUALIFIED) {
        router.push('/apply/not-eligible');
      }

      if (application.status === ApplicationStatus.SUBMITTED) {
        router.push('/apply/confirmation');
      }
    }, [application]);

    return <WrappedComponent {...props} />;
  };
}
