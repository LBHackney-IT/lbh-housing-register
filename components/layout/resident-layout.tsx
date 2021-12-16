import { useRouter } from 'next/router';
import React, { ReactNode, useState, useEffect } from 'react';
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
import Dialog from '../dialog';
import Paragraph from '../content/paragraph';
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
  const router = useRouter();
  const signOutRef = React.useRef(null);
  const dispatch = useAppDispatch();
  const application = useAppSelector((store) => store.application);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [signoutTimerEnded, setSignoutTimerEnded] = useState(false);

  const onSignOut = async () => {
    dispatch(exit());
  };

  const handleSignoutTimerEnded = () => {
    if (!application.id) return;
    setSignoutTimerEnded(true);
    setShowSignOutDialog(true);
    autoSignOut();
  };

  const autoSignOut = () => {
    if (!application.id) return;

    setShowSignOutDialog(false);

    console.log('autoSignOut');
    if (application.id) {
      signOutRef.current.click();
    }
  };

  const delay = 0.5; // minutes

  useEffect(
    () => {
      console.log('useEffect');

      let signOutTimer = setTimeout(() => handleSignoutTimerEnded(), 5 * 1000);
      // setTimeout(() => autoSignOut, delay * 1000 * 60);
      // this will clear Timeout
      // when component unmount like in willComponentUnmount
      // and show will not change to true
      return () => {
        clearTimeout(signOutTimer);
      };
    },
    // useEffect will run only one time with empty []
    // if you pass a value to array,
    // like this - [data]
    // than clearTimeout will run every time
    // this value changes (useEffect re-run)
    // [router.asPath]
    []
  );

  useEffect(
    () => {
      console.log('useEffect');

      let signOutDialogTimer = setTimeout(() => autoSignOut(), 10 * 1000); // 30 seconds
      return () => {
        clearTimeout(signOutDialogTimer);
      };
    },
    // useEffect will run only one time with empty []
    // if you pass a value to array,
    // like this - [data]
    // than clearTimeout will run every time
    // this value changes (useEffect re-run)
    // [router.asPath]
    [signoutTimerEnded]
  );

  return (
    <>
      {pageName && <Seo title={pageName} />}
      <SkipLink />
      <Header
        username={application.mainApplicant?.person?.firstName}
        logoLink="/"
        serviceName="Housing Register application"
        signOutText="Sign out"
        onSignOut={onSignOut}
        signOutRef={signOutRef}
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

      <Dialog
        isOpen={showSignOutDialog}
        title="Sign out"
        onCancel={() => setShowSignOutDialog(false)}
        onConfirmation={() => {
          onSignOut();
        }}
        onConfirmationText="Sign out"
        onCancelText="Stay logged in"
      >
        <Paragraph>
          Because there has been no input from you in the last 20 minutes you
          will be signed out of this application. You can sign back in later.
        </Paragraph>
      </Dialog>
    </>
  );
}
