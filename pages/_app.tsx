import Amplify from 'aws-amplify';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { ReactElement, useEffect } from 'react';
import { wrapper } from '../lib/store';
import { loadApplicaiton } from '../lib/store/application';
import { loadUser } from '../lib/store/cognitoUser';
import { useAppDispatch, useAppSelector } from '../lib/store/hooks';
import '../styles/global.scss';

function App({ Component, pageProps }: AppProps): ReactElement {
  Amplify.configure({
    Auth: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    },
  });

  // TODO all these initial renders are causing the form to show before any data has
  // loaded and that makes pre-filling impossible.
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  const user = useAppSelector((state) => state.cognitoUser);
  const applicationId = user?.attributes['custom:application_id'];
  useEffect(() => {
    dispatch(loadApplicaiton(applicationId));
  }, [applicationId]);

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_NAME} | Hackney Council</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>

      <Component {...pageProps} />
    </>
  );
}

export default wrapper.withRedux(App);
