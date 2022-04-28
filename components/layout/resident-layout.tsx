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
import { loadApplication } from '../../lib/store/application';
import Dialog from '../dialog';
import Paragraph from '../content/paragraph';
import Loading from '../../components/loading';
interface ResidentLayoutProps {
  pageName?: string;
  breadcrumbs?: { href: string; name: string }[];
  pageLoadsApplication?: boolean;
  children: ReactNode;
}

const INACTIVITY_TIME_BEFORE_WARNING_DIALOG = 30 * 1000 * 60; // 30 minutes
const TIME_TO_SHOW_DIALOG_BEFORE_SIGN_OUT = 30 * 1000; // 30 seconds

export default function ResidentLayout({
  pageName,
  breadcrumbs,
  pageLoadsApplication = true,
  children,
}: ResidentLayoutProps): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [loaded, setLoaded] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const signOutRef = useRef() as React.MutableRefObject<HTMLAnchorElement>;
  const application = useAppSelector((store) => store.application);

  useEffect(() => {
    if (!pageLoadsApplication) {
      setLoaded(true);
      return;
    }

    dispatch(loadApplication()).then(() => setLoaded(true));

    return () => {
      setLoaded(false);
    };
  }, []);

  const onSignOut = async () => {
    router.push('/');
    dispatch(exit());
  };

  const autoSignOut = () => {
    if (!application.id) return;

    setShowSignOutDialog(false);
    onSignOut();
  };

  const handleShowSignOutDialog = () => {
    let timeBeforeAutoSignOut = setTimeout(
      () => autoSignOut(),
      TIME_TO_SHOW_DIALOG_BEFORE_SIGN_OUT
    );
    setShowSignOutDialog(true);

    if (!application.id) {
      clearTimeout(timeBeforeAutoSignOut);
      return;
    }

    return () => {
      clearTimeout(timeBeforeAutoSignOut);
    };
  };

  const handleStayLoggedIn = () => {
    router.reload(); // reset timer
  };

  useEffect(() => {
    let timeBeforeShowSignOutDialog = setTimeout(
      () => handleShowSignOutDialog(),
      INACTIVITY_TIME_BEFORE_WARNING_DIALOG
    );

    if (!application.id) {
      clearTimeout(timeBeforeShowSignOutDialog);
      return;
    }

    return () => {
      clearTimeout(timeBeforeShowSignOutDialog);
    };
  }, [application.id]);

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
        <div className="lbh-container">
          {loaded ? children : <Loading text="Checking information…" />}
        </div>
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
