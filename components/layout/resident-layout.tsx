import React, { ReactNode, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';

import { loadApplication } from '../../lib/store/application';
import { selectApplicationLoadStatus } from '../../lib/store/application-load';
import { exit } from '../../lib/store/auth';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { hasPhaseBanner } from '../../lib/utils/phase-banner';
import Breadcrumbs, { BreadcrumbItem } from '../breadcrumbs';
import Dialog from 'lbh-frontend/dialog';
import Button from '../button';
import CookieBanner from '../content/CookieBanner';
import Paragraph from '../content/paragraph';
import ErrorSummary from '../errors/error-summary';
import Footer from '../footer';
import Header from '../header';
import Loading from '../loading';
import PhaseBanner from '../phase-banner';
import Seo from '../seo';
import SkipLink from '../skip-link';

interface ResidentLayoutProps {
  pageName?: string;
  breadcrumbs?: BreadcrumbItem[];
  pageLoadsApplication?: boolean;
  children?: ReactNode;
  dataTestId?: string;
}

const INACTIVITY_TIME_BEFORE_WARNING_DIALOG = 30 * 1000 * 60; // 30 minutes
const TIME_TO_SHOW_DIALOG_BEFORE_SIGN_OUT = 30 * 1000; // 30 seconds
const SIGN_IN_PATH = '/apply/sign-in';

function ApplicationLoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <>
      <ErrorSummary
        title="There is a problem"
        dataTestId="application-load-error"
      >
        <p>We could not load your application. Please try again.</p>
      </ErrorSummary>
      <Button onClick={onRetry} className="" type="button">
        Try again
      </Button>
    </>
  );
}

export default function ResidentLayout({
  pageName,
  breadcrumbs,
  pageLoadsApplication = true,
  children,
  dataTestId,
}: ResidentLayoutProps): JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  const signOutRef = useRef<HTMLAnchorElement | null>(null);
  const application = useAppSelector((store) => store.application);
  const loadStatus = useAppSelector(selectApplicationLoadStatus);

  useEffect(() => {
    if (!pageLoadsApplication) {
      return;
    }

    dispatch(loadApplication());
  }, [dispatch, pageLoadsApplication]);

  useEffect(() => {
    if (!pageLoadsApplication || loadStatus !== 'unauthenticated') {
      return;
    }

    router.replace(SIGN_IN_PATH);
  }, [loadStatus, pageLoadsApplication, router]);

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
    const timeBeforeAutoSignOut = setTimeout(
      () => autoSignOut(),
      TIME_TO_SHOW_DIALOG_BEFORE_SIGN_OUT,
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
    const timeBeforeShowSignOutDialog = setTimeout(
      () => handleShowSignOutDialog(),
      INACTIVITY_TIME_BEFORE_WARNING_DIALOG,
    );

    if (!application.id) {
      clearTimeout(timeBeforeShowSignOutDialog);
      return;
    }

    return () => {
      clearTimeout(timeBeforeShowSignOutDialog);
    };
  }, [application.id]);

  let content = children;
  if (pageLoadsApplication) {
    if (loadStatus === 'failed') {
      content = (
        <ApplicationLoadError onRetry={() => dispatch(loadApplication())} />
      );
    } else if (loadStatus !== 'loaded') {
      content = <Loading text="Checking information…" />;
    }
  }

  return (
    <div className="lbh-resident-layout-shell">
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

      <main
        id="main-content"
        className="lbh-main-wrapper lbh-resident-layout-shell__main"
      >
        <div className="lbh-container" data-testid={dataTestId}>
          {content}
        </div>
      </main>

      <Footer referenceNumber={application.reference ?? ''} />
      <CookieBanner />

      <Dialog
        isOpen={showSignOutDialog}
        title="Sign out"
        onDismiss={handleStayLoggedIn}
        onConfirm={handleStayLoggedIn}
        confirmText="Stay logged in"
      >
        <Paragraph>
          Because there has been no input from you in the last 30 minutes you
          will be signed out of this application in 30 seconds. You can sign
          back in later.
        </Paragraph>
      </Dialog>
    </div>
  );
}
