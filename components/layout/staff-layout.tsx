import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { useUser } from '../../lib/contexts/user-context';
import { signOut } from '../../lib/utils/auth';
import { hasPhaseBanner } from '../../lib/utils/phase-banner';
import Header from '../header';
import PhaseBanner from '../phase-banner';
import Seo from '../seo';
import SkipLink from '../skip-link';

interface StaffLayoutProps {
  pageName?: string;
  children: ReactNode;
}

export default function StaffLayout({
  pageName,
  children,
}: StaffLayoutProps): JSX.Element {
  const { user } = useUser();
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };

  return (
    <>
      {pageName && <Seo title={pageName} />}
      <SkipLink />
      <Header
        username={user?.name}
        signOutText="Sign out"
        onSignOut={signOut}
      />
      {hasPhaseBanner() && <PhaseBanner />}

      {id && (
        <div className="lbh-container">
          <nav>
            <strong className="lbh-heading-h5">
              <Link href={`/applications/`}>
                <a className="lbh-link">Back to dashboard</a>
              </Link>
            </strong>
          </nav>
        </div>
      )}

      <main id="main-content" className="lbh-main-wrapper">
        <div className="lbh-container">{children}</div>
      </main>
    </>
  );
}
