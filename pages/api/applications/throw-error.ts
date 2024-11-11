import { wrapApiHandlerWithSentry } from '@sentry/nextjs';
import { NextApiHandler } from 'next';

const endpoint: NextApiHandler = async () => {
  throw new Error('ErrorThrowingPage api error');
};

export default wrapApiHandlerWithSentry(
  endpoint,
  '/api/applications/throw-error'
);
