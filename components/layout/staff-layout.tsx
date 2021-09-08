import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FunctionComponent } from 'react';
import { useUser } from '../../lib/contexts/user-context';
import { signOut } from '../../lib/utils/auth';
import { hasPhaseBanner } from '../../lib/utils/phase-banner';
import Header from '../header';
import PhaseBanner from '../phase-banner';
import SkipLink from '../skip-link';

const StaffLayout: FunctionComponent = (props) => {
  const { user } = useUser();
  if (!user) return <></>;

  const router = useRouter();
  const { id, person } = router.query as {
    id: string;
    person: string;
  };

  return (
    <>
      <SkipLink />
      <Header username={user.name} signOutText="Sign out" onSignOut={signOut} />
      {hasPhaseBanner() && <PhaseBanner />}

      {id && !person && (
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
      {id && person && (
        <div className="lbh-container">
          <nav>
            <strong className="lbh-heading-h5">
              <Link href={`/applications/${id}`}>
                <a className="lbh-link">Back to household overview</a>
              </Link>
            </strong>
          </nav>
        </div>
      )}

      <main id="main-content" className="lbh-main-wrapper">
        <div className="lbh-container">{props.children}</div>
      </main>
    </>
  );
};

export default StaffLayout;
