import React, { ReactNode } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import { useUser } from '../../lib/contexts/user-context';
import { hasPhaseBanner } from '../../lib/utils/phase-banner';
import Header from '../header';
import PhaseBanner from '../phase-banner';
import Seo from '../seo';
import SkipLink from '../skip-link';

interface StaffLayoutProps {
  pageName?: string;
  children: ReactNode;
  dataTestId?: string;
}

export default function StaffLayout({
  pageName,
  children,
  dataTestId,
}: StaffLayoutProps): JSX.Element {
  const { user } = useUser();
  const router = useRouter();
  const { id, person } = router.query as {
    id: string;
    person: string;
  };

  const signOut = async () => {
    await fetch(`/api/admin/logout`);
    router.reload();
  };

  const applicationId = Array.isArray(id) ? id[0] : id;

  return (
    <>
      {pageName && <Seo title={pageName} />}
      <SkipLink />
      <Header
        username={user?.name}
        logoLink="/applications"
        serviceName="Housing Register admin"
        signOutText="Sign out"
        onSignOut={signOut}
      />
      {hasPhaseBanner() && <PhaseBanner />}

      {id && !person && (
        <div className="lbh-container">
          <nav>
            <strong className="lbh-heading-h5">
              <Link
                href="/applications/"
                prefetch={false}
                className="lbh-link lbh-link--no-visited-state"
                onClick={(e) => {
                  e.preventDefault();
                  // Full navigation so /applications getServerSideProps runs again;
                  globalThis.location.assign('/applications/');
                }}
              >
                Back to dashboard
              </Link>
            </strong>
          </nav>
        </div>
      )}
      {id && person && (
        <div className="lbh-container">
          <nav>
            <strong className="lbh-heading-h5">
              <Link
                href={`/applications/view/${applicationId}`}
                prefetch={false}
                className="lbh-link"
                onClick={(e) => {
                  e.preventDefault();
                  globalThis.location.assign(
                    `/applications/view/${applicationId}`,
                  );
                }}
              >
                Back to household overview
              </Link>
            </strong>
          </nav>
        </div>
      )}

      <main
        id="main-content"
        className="lbh-main-wrapper"
        data-testid={dataTestId}
      >
        <div className="lbh-container">{children}</div>
      </main>
    </>
  );
}
