import type { AppProps } from 'next/app';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import Layout from '../components/layout/resident-layout';
import Loading from '../components/loading';
import { wrapper } from '../lib/store';
import { loadApplication } from '../lib/store/application';
import { useAppDispatch } from '../lib/store/hooks';
import '../styles/global.scss';

function App({ Component, pageProps }: AppProps): ReactElement {
  const [loaded, setLoaded] = useState(false);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(loadApplication()).then(() => setLoaded(true));
  }, []);

  return (
    <>
      <Head>
        <title>Housing Register | Hackney Council</title>
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
