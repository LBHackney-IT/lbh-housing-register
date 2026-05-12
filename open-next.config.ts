/**
 * OpenNext config — converts the Next.js build into Lambda-deployable artifacts
 * under `.open-next/`.
 *
 * Output structure (after `npx open-next build`):
 *   .open-next/
 *     server-functions/default/   server Lambda bundle (handler: index.handler)
 *     assets/                     static files for S3 + CloudFront
 *     cache/                      ISR cache seed (empty for this app)
 *     image-optimization-function/   built but not deployed (see below)
 *     warmer-function/               built but not deployed (see below)
 *     revalidation-function/         built but not deployed (see below)
 *
 * Notes:
 *  - OpenNext v4 always emits image-opt, warmer, and revalidation bundles —
 *    there is no toggle to skip them. We simply don't deploy them.
 *  - We override `imageOptimization.install` to a falsy value so OpenNext's
 *    `installDependencies` short-circuits and skips the `npm install sharp`
 *    step that runs by default. The image-opt bundle still exists on disk,
 *    just without `sharp`; harmless because we never invoke it.
 *  - `dangerous.disableIncrementalCache` and `disableTagCache` strip the S3 /
 *    DynamoDB cache wiring from the server bundle. This app has no ISR /
 *    revalidateTag usage, so neither is needed and skipping them avoids
 *    requiring the cache bucket + DDB table at deploy time.
 */
import type {
  InstallOptions,
  OpenNextConfig,
} from '@opennextjs/aws/types/open-next';

const config: OpenNextConfig = {
  // Override OpenNext's default of `npm run build`. The legacy `npm run build`
  // also fires a postbuild hook (now a no-op) and would force `next build` to
  // run twice if we also invoked it from the npm script — wasted CI minutes.
  // Run only the webpack-flavoured Next build here.
  buildCommand: 'next build --webpack',

  default: {
    override: {
      // AWS API Gateway v1 (REST API) is what the existing Serverless Framework
      // setup uses. Switch to 'aws-apigw-v2' if you migrate to HTTP APIs.
      converter: 'aws-apigw-v1',
      wrapper: 'aws-lambda',
    },
  },
  imageOptimization: {
    // `installDependencies(outputPath, opts)` early-returns when `opts` is falsy
    // (see node_modules/@opennextjs/aws/dist/build/installDeps.js). The TS type
    // is `InstallOptions | undefined`, but `??` only falls back on null/undefined,
    // so we need a falsy non-undefined value to bypass the default `sharp` install.
    // Cast via `unknown` to keep `no-explicit-any` happy while preserving the
    // runtime falsy value.
    install: false as unknown as InstallOptions,
  },
  dangerous: {
    disableIncrementalCache: true,
    disableTagCache: true,
  },
};

export default config;
