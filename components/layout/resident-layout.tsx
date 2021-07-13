import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { useStore } from 'react-redux';
import { Store } from '../../lib/store';
import { logOut } from '../../lib/store/applicant';
import { hasPhaseBanner } from '../../lib/utils/phase-banner';
import Breadcrumbs from '../breadcrumbs';
import Header from '../header';
import PhaseBanner from '../phase-banner';
import SkipLink from '../skip-link';

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
