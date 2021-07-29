import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ReactElement } from 'react';

export default class AppDocument extends Document {
  render(): ReactElement {
    return (
      <Html id="root" lang="en">
        <Head>
          <title>Housing Register | Hackney Council</title>
        </Head>
        <body className="govuk-template__body lbh-template__body js-enabled">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
