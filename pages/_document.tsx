import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ReactElement } from 'react';

export default class AppDocument extends Document {
  render(): ReactElement {
    return (
      <Html id="root" lang="en">
        <Head>
          {process.env.NEXT_PUBLIC_ENV === 'production' ? (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer","GTM-P3HRQWH");`,
              }}
            />
          ) : null}
        </Head>
        <body className="govuk-template__body lbh-template__body js-enabled">
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-P3HRQWH"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
