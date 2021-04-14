import Header from "./components/Header/Header"
import PhaseBanner from "./components/PhaseBanner/PhaseBanner"
import SkipLink from "./components/SkipLink/SkipLink"
import ApplicationForm from "./pages/ApplicationForm"
import ErrorPage from "./pages/ErrorPage"
import NotFound from "./pages/ErrorPage/NotFound"
import Home from "./pages/Home"
import { BrowserRouter, Switch, Route } from "react-router-dom"

const HousingRegisterApp = (): JSX.Element => {
  let hasPhaseBanner = process.env.REACT_APP_VERSION && parseFloat(process.env.REACT_APP_VERSION) <= 1

  return (
    <>
      <SkipLink />
      <Header />
      
      {hasPhaseBanner ? <PhaseBanner /> : null}
      
      <main id="main-content" className="lbh-main-wrapper">
        <div className="lbh-container">
          <BrowserRouter>
            <Switch>
              <Route path="/apply/:step?">
                <ApplicationForm />
              </Route>
              <Route exact path="/">
                <Home />
              </Route>
              <Route>
                <ErrorPage statusCode={404}>
                  <NotFound />
                </ErrorPage>
              </Route>
            </Switch>
          </BrowserRouter>
        </div>
      </main>
    </>
  )
}

export default HousingRegisterApp