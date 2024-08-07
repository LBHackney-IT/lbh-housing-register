import React, { useEffect } from 'react';

import { useRouter } from 'next/router';

import { exit } from '../store/auth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ApplicationStatus } from '../types/application-status';

export default function withApplication<P>(
  WrappedComponent: React.ComponentType<P>
) {
  return function (props: P) {
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
