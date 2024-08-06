import React, { ReactElement } from 'react';

import Head from 'next/head';

import { wrapper } from '../lib/store';

import type { AppProps } from 'next/app';
import '../styles/global.scss';

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <>
      <Head>
        <title>Housing Register | Hackney Council</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default wrapper.withRedux(App);
