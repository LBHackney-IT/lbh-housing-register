import { wrapper } from '../lib/store';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { ReactElement, useEffect } from 'react';
import '../styles/global.scss';
import Amplify from 'aws-amplify';
import { useAppDispatch, useAppSelector } from '../lib/store/hooks';
import { loadUser } from '../lib/store/cognitoUser';
import { loadApplicaiton } from '../lib/store/application';

function App({ Component, pageProps }: AppProps): ReactElement {
  Amplify.configure({
    Auth: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    },
  });

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  const user = useAppSelector((state) => state.cognitoUser);
  useEffect(() => {
    if (user) {
      //     // don't do this without an effect. You just got rate limited.
      //     Auth.currentAuthenticatedUser().then((user: CognitoUser) => {
      //       Auth.updateUserAttributes(user, {
      //         'custom:application_id': '0b8bf684-e3ae-499a-af05-fafcefca6f46',
      //       });
      //     });
      dispatch(loadApplicaiton(user.attributes['custom:application_id']));
    }
  }, [user]);

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

/*
 * So when the page loads we'll want to retrieve anything that we know.
 */
