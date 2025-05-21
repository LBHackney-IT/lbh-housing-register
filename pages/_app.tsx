import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import React, { ReactElement } from 'react';
import { wrapper } from '../lib/store';
import '../styles/global.scss';
import { SessionProvider } from 'next-auth/react';

import { Session } from 'next-auth';

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: Session;
}>): ReactElement {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Housing Register | Hackney Council</title>
      </Head>
      <Script id="gtm" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
      `}
      </Script>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default wrapper.withRedux(App);
