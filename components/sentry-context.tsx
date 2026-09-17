import * as Sentry from '@sentry/nextjs';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector } from '../lib/store/hooks';

type SentryContextProps = {
  staffUserId?: string;
};

export const getSentrySurface = (route: string): string => {
  if (route.startsWith('/applications')) return 'staff';
  if (route.startsWith('/apply')) return 'resident';
  return 'public';
};

export default function SentryContext({
  staffUserId,
}: SentryContextProps): null {
  const router = useRouter();
  const residentApplicationId = useAppSelector((state) => state.application.id);
  const staffApplicationId =
    typeof router.query.id === 'string' ? router.query.id : undefined;
  const applicationId = staffApplicationId ?? residentApplicationId;
  const surface = getSentrySurface(router.pathname);

  useEffect(() => {
    Sentry.setTag('route', router.pathname);
    Sentry.setTag('surface', surface);
    Sentry.setTag('application_id', applicationId);
    Sentry.setUser(staffUserId ? { id: staffUserId } : null);
  }, [applicationId, router.pathname, staffUserId, surface]);

  return null;
}
