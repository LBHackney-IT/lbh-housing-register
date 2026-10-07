import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { useLayoutEffect } from 'react';
import { useAppSelector } from '../lib/store/hooks';
import { getSentrySurface } from '../lib/utils/sentry';

export { getSentrySurface };

type SentryContextProps = {
  staffCognitoSub?: string;
};

const applySentryContext = (
  route: string,
  applicationId: string | undefined,
  staffCognitoSub: string | undefined,
): void => {
  const surface = getSentrySurface(route);

  let authProvider = 'none';
  if (surface === 'staff') {
    authProvider = 'cognito';
  } else if (surface === 'resident') {
    authProvider = 'hackney-jwt';
  }

  let sentryUserId: string | undefined;
  if (surface === 'staff' && staffCognitoSub) {
    sentryUserId = `cognito:${staffCognitoSub}`;
  } else if (surface === 'resident' && applicationId) {
    sentryUserId = `resident-application:${applicationId}`;
  }

  Sentry.setTag('route', route);
  Sentry.setTag('surface', surface);
  Sentry.setTag('auth_provider', authProvider);
  Sentry.setTag('application_id', applicationId);
  if (sentryUserId) {
    Sentry.setUser({ id: sentryUserId });
  } else {
    Sentry.setUser(null);
  }
};

const staffApplicationIdFromPath = (path: string): string | undefined =>
  path.match(/^\/applications\/view\/([^/]+)/)?.[1];

export default function SentryContext({
  staffCognitoSub,
}: SentryContextProps): null {
  const router = useRouter();
  const residentApplicationId = useAppSelector((state) => state.application.id);
  let staffApplicationId: string | undefined;
  if (typeof router.query.id === 'string') {
    staffApplicationId = router.query.id;
  }
  const surface = getSentrySurface(router.pathname);
  let applicationId: string | undefined;
  if (surface === 'staff') {
    applicationId = staffApplicationId;
  } else if (surface === 'resident') {
    applicationId = residentApplicationId;
  }

  useLayoutEffect(() => {
    applySentryContext(router.pathname, applicationId, staffCognitoSub);

    const onRouteChangeStart = (url: string) => {
      const path = url.split(/[?#]/)[0];
      const nextSurface = getSentrySurface(path);
      Sentry.setTag('surface', nextSurface);

      if (nextSurface === 'staff') {
        const id = staffApplicationIdFromPath(path);
        if (id) Sentry.setTag('application_id', id);
        return;
      }

      if (nextSurface === 'resident') {
        Sentry.setTag('application_id', residentApplicationId);
        return;
      }

      Sentry.setTag('application_id', undefined);
      Sentry.setUser(null);
    };

    router.events.on('routeChangeStart', onRouteChangeStart);
    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart);
    };
  }, [
    applicationId,
    residentApplicationId,
    router.events,
    router.pathname,
    staffCognitoSub,
  ]);

  return null;
}
