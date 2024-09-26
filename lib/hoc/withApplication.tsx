import React, { useEffect } from 'react';

import { NextRouter, useRouter } from 'next/router';

import { Application } from 'domain/HousingApi';
import { AppDispatch } from 'lib/store';

import { exit } from '../store/auth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { ApplicationStatus } from '../types/application-status';

function useApplicationRedirect(application: Application) {
  const router = useRouter();

  useEffect(() => {
    if (application.status === ApplicationStatus.DISQUALIFIED) {
      router.push('/apply/not-eligible');
    }

    if (application.status === ApplicationStatus.SUBMITTED) {
      router.push('/apply/confirmation');
    }
  }, [application.status]);
}

function handleNoApplication(
  application: Application,
  router: NextRouter,
  dispatch: AppDispatch
) {
  if (!application) {
    router.push('/');
    dispatch(exit());
  }
}

export default function withApplication<P>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithApplication = (props: P & { children?: React.ReactNode }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const application = useAppSelector((store) => store.application);

    handleNoApplication(application, router, dispatch);
    useApplicationRedirect(application);

    return <WrappedComponent {...props} />;
  };

  return WithApplication;
}
