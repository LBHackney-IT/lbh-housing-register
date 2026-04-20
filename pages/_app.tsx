import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { wrapper } from '../lib/store';
import '../styles/global.scss';

function App(props: AppProps): ReactElement {
  const { store, props: combinedProps } = wrapper.useWrappedStore(props);
  const { Component, pageProps } = combinedProps;

  return (
    <>
      <Head>
        <title>Housing Register | Hackney Council</title>
      </Head>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default App;
