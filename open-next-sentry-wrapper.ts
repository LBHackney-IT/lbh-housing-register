/**
 * Custom OpenNext wrapper that fixes Sentry request/breadcrumb isolation.
 *
 * The default `aws-lambda` wrapper invokes the Next.js request handler
 * directly against a synthetic req/res pair built from the API Gateway
 * event — it never goes through a real, listening `http.Server`. Sentry's
 * automatic per-request scope isolation relies on instrumenting
 * `http.Server`'s `request` event, so on this deployment it never fires.
 * The practical effect: every request handled by the same warm Lambda
 * container shares one global isolation scope, so breadcrumbs/tags/context
 * from unrelated requests (e.g. a staff member browsing applications) can
 * end up attached to a completely unrelated error from another request
 * (e.g. a Notify API failure), making Sentry breadcrumbs unreliable.
 *
 * This is the fix the Sentry maintainers recommend for OpenNext: wrap the
 * underlying Lambda handler explicitly with `Sentry.wrapHandler`, which
 * manages its own isolation scope per invocation regardless of how the
 * handler is invoked.
 *
 * https://opennext.js.org/aws/config/custom_overrides
 * https://github.com/getsentry/sentry-javascript/issues/13871
 */
import awsLambdaWrapper from '@opennextjs/aws/overrides/wrappers/aws-lambda.js';
import type { WrapperHandler } from '@opennextjs/aws/types/overrides.js';
import { wrapHandler } from '@sentry/aws-serverless';

const wrapper: WrapperHandler = async (handler, converter) => {
  const defaultHandler = await awsLambdaWrapper.wrapper(handler, converter);
  return wrapHandler(defaultHandler);
};

export default {
  wrapper,
  name: 'aws-lambda-sentry',
  supportStreaming: false,
};
