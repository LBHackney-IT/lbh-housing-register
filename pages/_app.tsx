import * as Sentry from '@sentry/nextjs';
import type { AppProps } from 'next/app';
import NextErrorComponent from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import SentryContext from '../components/sentry-context';
import { wrapper } from '../lib/store';
import '../styles/global.scss';

type PagePropsWithStaffUser = {
  user?: {
    sub?: string;
  };
};

type AppPropsWithError = AppProps<PagePropsWithStaffUser> & {
  err?: Error;
};

function App(props: AppPropsWithError): ReactElement {
  const { store, props: combinedProps } = wrapper.useWrappedStore(props);
  const { Component, pageProps } = combinedProps;
  const router = useRouter();
  const staffCognitoSub = pageProps.user?.sub;

  return (
    <>
      <Head>
        <title>Housing Register | Hackney Council</title>
      </Head>
      <Provider store={store}>
        <Sentry.ErrorBoundary
          key={router.pathname}
          fallback={<NextErrorComponent statusCode={500} />}
        >
          <SentryContext staffCognitoSub={staffCognitoSub} />
          <Component {...pageProps} err={props.err} />
        </Sentry.ErrorBoundary>
      </Provider>
    </>
  );
}

export default App;
