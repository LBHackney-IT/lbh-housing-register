import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import Layout from '../components/layout/resident-layout';
import Loading from '../components/loading';
import { wrapper } from '../lib/store';
import { useAppDispatch } from '../lib/store/hooks';
import { initStore } from '../lib/store/init';
import '../styles/global.scss';

function App({ Component, pageProps }: AppProps): ReactElement {
  const waitForLoad = typeof window !== 'undefined';
  const [loaded, setLoaded] = useState(!waitForLoad);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initStore()).then(() => setLoaded(true));
  }, []);

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_NAME} | Hackney Council</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </Head>
      {!loaded && (
        <Layout>
          <Loading text="Checking information…" />
        </Layout>
      )}
      {loaded && <Component {...pageProps} />}
    </>
  );
}

export default wrapper.withRedux(App);
