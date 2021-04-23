import React, { FunctionComponent } from 'react';
import PhaseBanner from '../phase-banner';
import SkipLink from '../skip-link';
import Header from '../header';
import { hasPhaseBanner } from "../../lib/utils/phase-banner";

const ResidentLayout: FunctionComponent = (props) => {
  return (
    <>
      <SkipLink />
      <Header />
      {hasPhaseBanner() && <PhaseBanner />}

      <main id="main-content" className="lbh-main-wrapper">
        <div className="lbh-container">
          {props.children}
        </div>
      </main>
    </>
  )
}

export default ResidentLayout;
