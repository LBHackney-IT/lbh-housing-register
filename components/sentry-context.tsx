import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector } from '../lib/store/hooks';

type SentryContextProps = {
  staffCognitoSub?: string;
};

export const getSentrySurface = (route: string): string => {
  if (route.startsWith('/applications')) return 'staff';
  if (route.startsWith('/apply')) return 'resident';
  return 'public';
};

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

  useEffect(() => {
    Sentry.setTag('route', router.pathname);
    Sentry.setTag('surface', surface);
    Sentry.setTag('auth_provider', authProvider);
    Sentry.setTag('application_id', applicationId);
    Sentry.setUser(sentryUserId ? { id: sentryUserId } : null);
  }, [applicationId, authProvider, router.pathname, sentryUserId, surface]);

  return null;
}
