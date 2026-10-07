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
  const authProvider =
    surface === 'staff'
      ? 'cognito'
      : surface === 'resident'
        ? 'hackney-jwt'
        : 'none';
  const sentryUserId =
    surface === 'staff' && staffCognitoSub
      ? `cognito:${staffCognitoSub}`
      : surface === 'resident' && applicationId
        ? `resident-application:${applicationId}`
        : undefined;

  Sentry.setTag('route', route);
  Sentry.setTag('surface', surface);
  Sentry.setTag('auth_provider', authProvider);
  Sentry.setTag('application_id', applicationId);
  Sentry.setUser(sentryUserId ? { id: sentryUserId } : null);
};

const staffApplicationIdFromPath = (path: string): string | undefined =>
  path.match(/^\/applications\/view\/([^/]+)/)?.[1];

export default function SentryContext({
  staffCognitoSub,
}: SentryContextProps): null {
  const router = useRouter();
  const residentApplicationId = useAppSelector((state) => state.application.id);
  const staffApplicationId =
    typeof router.query.id === 'string' ? router.query.id : undefined;
  const surface = getSentrySurface(router.pathname);
  const applicationId =
    surface === 'staff'
      ? staffApplicationId
      : surface === 'resident'
        ? residentApplicationId
        : undefined;

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
