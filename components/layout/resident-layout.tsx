import PhaseBanner from '../phase-banner';
import Breadcrumbs from '../breadcrumbs';
import SkipLink from '../skip-link';
import Header from '../header';
import { hasPhaseBanner } from '../../lib/utils/phase-banner';
import React, { ReactNode } from 'react';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { logOut } from '../../lib/store/resident';
import { Store } from '../../lib/store';
import { useStore } from 'react-redux';

interface ResidentLayoutProps {
  breadcrumbs?: { href: string; name: string }[];
  children: ReactNode;
}

export default function ResidentLayout({
  breadcrumbs,
  children,
}: ResidentLayoutProps): JSX.Element {
  const router = useRouter();
  const store = useStore<Store>();
  const resident = store.getState().resident;

  const signOut = async () => {
    try {
      await Auth.signOut();

      store.dispatch(logOut());
      router.push('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  };

  return (
    <>
      <SkipLink />
      <Header username={resident?.username} onSignOut={signOut} />
      {hasPhaseBanner() && <PhaseBanner />}

      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      <main id="main-content" className="lbh-main-wrapper">
        <div className="lbh-container">{children}</div>
      </main>
    </>
  );
}
