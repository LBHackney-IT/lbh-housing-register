import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { signOut } from '../../lib/store/cognitoUser';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
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
  const dispatch = useAppDispatch();
  const username = useAppSelector((store) => store.cognitoUser?.attributes.given_name);

  const onSignOut = async () => {
    dispatch(signOut());
    router.push('/');
  };

  return (
    <>
      <SkipLink />
      <Header username={username} onSignOut={onSignOut} />
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
