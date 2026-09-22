import * as Sentry from '@sentry/nextjs';
import type { AppProps } from 'next/app';
import NextErrorComponent from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import SentryContext, { getSentrySurface } from '../components/sentry-context';
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
  const surface = getSentrySurface(router.pathname);
  const staffApplicationId =
    surface === 'staff' && typeof router.query.id === 'string'
      ? router.query.id
      : undefined;

  return (
    <>
      <Head>
        <title>Housing Register | Hackney Council</title>
      </Head>
      <Sentry.ErrorBoundary
        key={router.pathname}
        fallback={<NextErrorComponent statusCode={500} />}
        beforeCapture={(scope) => {
          scope.setTag('route', router.pathname);
          scope.setTag('surface', surface);
          scope.setTag(
            'auth_provider',
            surface === 'staff'
              ? 'cognito'
              : surface === 'resident'
                ? 'hackney-jwt'
                : 'none',
          );
          scope.setTag('application_id', staffApplicationId);
          scope.setUser(
            surface === 'staff' && staffCognitoSub
              ? { id: `cognito:${staffCognitoSub}` }
              : null,
          );
        }}
      >
        <Provider store={store}>
          <SentryContext staffCognitoSub={staffCognitoSub} />
          <Component {...pageProps} err={props.err} />
        </Provider>
      </Sentry.ErrorBoundary>
    </>
  );
}

export default App;
