import logo from "lbh-frontend/dist/assets/images/lbh-logo.svg"
import "./Header.scss"

const Header = (): JSX.Element => (
  <header className="lbh-header ">
    <div className="lbh-header__main">
      <div className="lbh-container lbh-header__wrapper">
        <h1 className="lbh-header__title">
          <a href="/" className="lbh-header__title-link">
            <img src={logo} alt="Hackney" />
            <span className="lbh-header__logo-text">Hackney</span>
            <span className="lbh-header__service-name">{process.env.REACT_APP_NAME}</span>
          </a>
        </h1>
      </div>
    </div>
  </header>
)

export default Header