import Document, { Head, Html, Main, NextScript } from 'next/document';

import { ReactElement } from 'react';

// NEXT_PUBLIC_GTM_ID is set in the build context during the build process.
const googleTagId = process.env.NEXT_PUBLIC_GTM_ID;

export default class AppDocument extends Document {
  render(): ReactElement {
    return (
      <Html id="root" lang="en">
        <Head>
          {googleTagId ? (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleTagId)}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(googleTagId)});`,
                }}
              />
            </>
          ) : null}
        </Head>
        <body className="govuk-template__body lbh-template__body js-enabled">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
