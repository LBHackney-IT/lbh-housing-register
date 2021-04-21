import Image from "next/image"
import Link from "next/link"

interface HeaderProps {
  userName?: string;
}

export default function Header({ userName }: HeaderProps): JSX.Element {
  return (
    <header className="lbh-header ">
      <div className="lbh-header__main">
        <div className="lbh-container lbh-header__wrapper">
          <h1 className="lbh-header__title">
            <Link href="/">
              <a className="lbh-header__title-link">
                <Image src="/images/logo.svg" alt="Hackney" width="210" height="40" />
                <span className="lbh-header__logo-text">Hackney</span>
                <span className="lbh-header__service-name">{process.env.NEXT_PUBLIC_NAME}</span>
              </a>
            </Link>
          </h1>
          {userName && (
            <div className="lbh-header__links">
              <p>{userName}</p>
              <a href="/">Sign out</a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
