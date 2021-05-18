import PhaseBanner from "../phase-banner"
import Breadcrumbs from "../breadcrumbs"
import SkipLink from "../skip-link"
import Header from "../header"
import { hasPhaseBanner } from "../../lib/utils/phase-banner"
import React, { ReactNode, useEffect } from "react"
import { Auth } from 'aws-amplify'
import { CognitoUser } from '@aws-amplify/auth'
import Button from "../../components/button";
import { useRouter } from "next/router";
import { useState } from "react";
import { logIn, logOut } from "../../lib/store/resident"
import { Store } from "../../lib/store"
import { useStore } from "react-redux"

interface ResidentLayoutProps {
  breadcrumbs?: { href: string, name: string }[]
  children: ReactNode
}

export default function ResidentLayout({ breadcrumbs, children }: ResidentLayoutProps): JSX.Element {

  const router = useRouter()
  const store = useStore<Store>()
  const resident = store.getState().resident

  useEffect(() => {
    Auth.currentSession().then((session) => {
      if (session && session.isValid()) {
        Auth.currentAuthenticatedUser().then((user: CognitoUser) => {
          store.dispatch(logIn())
        })
      }
    })
  }, [])

  const signOut = async () => {
    try {
      await Auth.signOut()

      store.dispatch(logOut())
      router.push("/")
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

          {resident.isLoggedIn &&
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
