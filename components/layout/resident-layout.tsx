import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { hasPhaseBanner } from '../../lib/utils/phase-banner';
import Breadcrumbs from '../breadcrumbs';
import Header from '../header';
import PhaseBanner from '../phase-banner';
import SkipLink from '../skip-link';
import Seo from '../seo';
import Footer from '../footer';
import CookieBanner from '../content/CookieBanner';
import { exit } from '../../lib/store/auth';

interface ResidentLayoutProps {
  pageName?: string;
  breadcrumbs?: { href: string; name: string }[];
  children: ReactNode;
}

export default function ResidentLayout({
  pageName,
  breadcrumbs,
  children,
}: ResidentLayoutProps): JSX.Element {
  const dispatch = useAppDispatch();
  const application = useAppSelector((store) => store.application);

  const onSignOut = async () => {
    dispatch(exit());
  };

  return (
    <>
      {pageName && <Seo title={pageName} />}
      <SkipLink />
      <Header
        username={application.mainApplicant?.person?.firstName}
        logoLink="/"
        serviceName="Housing Register application"
        signOutText="Save and exit"
        onSignOut={onSignOut}
      />
      {hasPhaseBanner() && <PhaseBanner />}

      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} />
      )}

      <main id="main-content" className="lbh-main-wrapper">
        <div className="lbh-container">{children}</div>
      </main>

      <Footer referenceNumber={application.reference ?? ''} />
      <CookieBanner />
    </>
  );
}
