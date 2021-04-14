import Header from "../components/header"
import PhaseBanner from "../components/phase-banner"
import SkipLink from "../components/skip-link"
import "../styles/global.scss"

function HousingRegisterApp({ Component, pageProps }) {
  const hasPhaseBanner = parseFloat(process.env.NEXT_PUBLIC_VERSION) < 1

  return (
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
  )
}

export default HousingRegisterApp