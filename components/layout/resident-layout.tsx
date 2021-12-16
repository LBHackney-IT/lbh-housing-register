import { useRouter } from 'next/router';
import React, { ReactNode, useState, useEffect, useRef } from 'react';
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
  const signOutRef = useRef() as React.MutableRefObject<HTMLAnchorElement>;
  const dispatch = useAppDispatch();
  const application = useAppSelector((store) => store.application);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const inactivityTimeBeforeWarningDialog = 30 * 1000 * 60; // 30 minutes
  const showWarningDialogBeforeSignOut = 30 * 1000; // 30 seconds

  const onSignOut = async () => {
    dispatch(exit());
  };

  const autoSignOut = () => {
    if (!application.id) return;

    setShowSignOutDialog(false);
    console.log('autoSignOut');
    if (application.id) {
      signOutRef.current.click();
    }
  };

  const handleTimeBeforeShowSignOutDialogEnded = () => {
    if (!application.id) return;

    // console.log('Dialog timer started');
    setTimeout(() => autoSignOut(), showWarningDialogBeforeSignOut);
    setShowSignOutDialog(true);
  };

  const handleStayLoggedIn = () => {
    router.reload();
  };

  useEffect(() => {
    // console.log('Time before showing warning dialog');

    let timeBeforeShowSignOutDialog = setTimeout(
      () => handleTimeBeforeShowSignOutDialogEnded(),
      inactivityTimeBeforeWarningDialog
    );
    return () => {
      clearTimeout(timeBeforeShowSignOutDialog);
    };
  }, []);

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
        onConfirmation={handleStayLoggedIn}
        onConfirmationText="Stay logged in"
      >
        <Paragraph>
          Because there has been no input from you in the last 30 minutes you
          will be signed out of this application in 30 seconds. You can sign
          back in later.
        </Paragraph>
      </Dialog>
    </>
  );
}
