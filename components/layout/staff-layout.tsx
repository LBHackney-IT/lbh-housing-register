import React, { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PhaseBanner from '../phase-banner';
import SkipLink from '../skip-link';
import Header from '../header';
import { hasPhaseBanner } from "../../lib/utils/phase-banner";

const StaffLayout: FunctionComponent = (props) => {
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };

  return (
    <>
      <SkipLink />
      <Header userName="Test User" />
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
        <div className="lbh-container">
          {props.children}
        </div>
      </main>
    </>
  )
}

export default StaffLayout;
