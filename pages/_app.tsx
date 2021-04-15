import Header from "../components/header"
import PhaseBanner from "../components/phase-banner"
import SkipLink from "../components/skip-link"
import type { AppProps } from 'next/app'
import Head from "next/head"
import "../styles/global.scss"

export default function HousingRegisterApp({ Component, pageProps }: AppProps): JSX.Element {
  const hasPhaseBanner = parseFloat(process.env.NEXT_PUBLIC_VERSION!) < 1

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_NAME} | Hackney Council</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <>
        <SkipLink />
        <Header />
        {hasPhaseBanner && <PhaseBanner />}

        <main id="main-content" className="lbh-main-wrapper">
          <div className="lbh-container">
            <Component {...pageProps} />
          </div>
        </main>
      </>
    </>
  )
}