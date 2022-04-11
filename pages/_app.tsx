import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import { wrapper } from '../lib/store';
import '../styles/global.scss';

function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <>
      <Head>
        <title>Housing Register | Hackney Council</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default wrapper.withRedux(App);
