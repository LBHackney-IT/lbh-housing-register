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
 *
 * Also rejects request URLs that Node cannot parse. The API Gateway converter
 * builds `url` by concatenating the host header, and `routingHandler` later
 * calls `new URL(event.url)`. When that throws, its catch builds the Next.js
 * 500 page with `new URL("/500", event.url)`. The second throw is outside the
 * catch, so the Lambda invocation fails. Those requests get 400 before routing.
 */
import awsLambdaWrapper from '@opennextjs/aws/overrides/wrappers/aws-lambda.js';
import type { WrapperHandler } from '@opennextjs/aws/types/overrides.js';
import { wrapHandler } from '@sentry/aws-serverless';
import { StatusCodes } from 'http-status-codes';

function isWarmerEvent(event: unknown): boolean {
  return typeof event === 'object' && event !== null && 'type' in event;
}

function isUnparseableRequestUrl(internalEvent: unknown): boolean {
  if (
    typeof internalEvent !== 'object' ||
    internalEvent === null ||
    !('url' in internalEvent) ||
    typeof internalEvent.url !== 'string'
  ) {
    return false;
  }

  try {
    new URL(internalEvent.url);
    return false;
  } catch {
    return true;
  }
}

function badRequest() {
  return {
    statusCode: StatusCodes.BAD_REQUEST,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
    body: 'Bad Request',
    isBase64Encoded: false,
  };
}

const wrapper: WrapperHandler = async (handler, converter) => {
  const defaultHandler = await awsLambdaWrapper.wrapper(handler, converter);

  const guarded = async (event: unknown) => {
    if (!isWarmerEvent(event)) {
      const internalEvent = await converter.convertFrom(event as never);
      if (isUnparseableRequestUrl(internalEvent)) {
        return badRequest();
      }
    }

    return defaultHandler(event as never);
  };

  return wrapHandler(guarded as never);
};

export default {
  wrapper,
  name: 'aws-lambda-sentry',
  supportStreaming: false,
};
