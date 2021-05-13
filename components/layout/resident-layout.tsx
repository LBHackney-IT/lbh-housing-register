import PhaseBanner from "../phase-banner"
import Breadcrumbs from "../breadcrumbs"
import SkipLink from "../skip-link"
import Header from "../header"
import { hasPhaseBanner } from "../../lib/utils/phase-banner"
import React, { ReactNode } from "react"
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';

interface ResidentLayoutProps {
  breadcrumbs?: { href: string, name: string }[]
  children: ReactNode
}

const ResidentLayout = ({ breadcrumbs, children }: ResidentLayoutProps): JSX.Element => {
  return (
    <>
      <SkipLink />
      <Header />
      {hasPhaseBanner() && <PhaseBanner />}

      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

      <main id="main-content" className="lbh-main-wrapper">
        <div className="lbh-container">
          <AmplifySignOut />
          {children}
        </div>
      </main>
    </>
  )
}

export default withAuthenticator(ResidentLayout)
