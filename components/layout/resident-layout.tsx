import PhaseBanner from "../phase-banner"
import Breadcrumbs from "../breadcrumbs"
import SkipLink from "../skip-link"
import Header from "../header"
import { hasPhaseBanner } from "../../lib/utils/phase-banner"
import React, { ReactNode } from "react"
import { Auth } from 'aws-amplify';
import Button from "../../components/button";
import { useRouter } from "next/router";
import { useState } from "react";

interface ResidentLayoutProps {
  breadcrumbs?: { href: string, name: string }[]
  children: ReactNode
}

export default function ResidentLayout({ breadcrumbs, children }: ResidentLayoutProps): JSX.Element {

  const router = useRouter()
  const [isLoggedIn, setLoggedIn] = useState(false)

  // TODO: use store
  Auth.currentAuthenticatedUser()
    .then(user => setLoggedIn(true))
    .catch(err => console.log(err));

  const signOut = async () => {
    try {
      await Auth.signOut()

      // TODO: update store
      router.push("/apply")
    } catch (error) {
      console.log('error signing out: ', error)
    }
  }

  return (
    <>
      <SkipLink />
      <Header />
      {hasPhaseBanner() && <PhaseBanner />}

      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

      <main id="main-content" className="lbh-main-wrapper">
        <div className="lbh-container">

          {isLoggedIn &&
            <Button onClick={signOut} secondary>
              Sign out
            </Button>
          }

          {children}
        </div>
      </main>
    </>
  )
}
