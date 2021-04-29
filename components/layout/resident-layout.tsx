import React, { ReactNode } from 'react';
import PhaseBanner from '../phase-banner';
import SkipLink from '../skip-link';
import Header from '../header';
import { hasPhaseBanner } from "../../lib/utils/phase-banner";
import Breadcrumbs from '../breadcrumbs';

interface ResidentLayoutProps {
  breadcrumbs?: { href: string, name: string}[]
  children: ReactNode
}

export default function ResidentLayout({ breadcrumbs, children }: ResidentLayoutProps): JSX.Element {
  return (
    <>
      <SkipLink />
      <Header />
      {hasPhaseBanner() && <PhaseBanner />}
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

      <main id="main-content" className="lbh-main-wrapper">
        <div className="lbh-container">
          {children}
        </div>
      </main>
    </>
  )
}