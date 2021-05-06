import { Store } from "../lib/store"
import { logIn, logOut } from "../lib/store/user"
import Image from "next/image"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"


export default function Header(): JSX.Element {
  let { user } = useSelector<Store, Store>(state => state)
  const dispatch = useDispatch()

  return (
    <header className="lbh-header ">
      <div className="lbh-header__main">
        <div className="lbh-container lbh-header__wrapper">
          <h1 className="lbh-header__title">
            <Link href="/">
              <a className="lbh-header__title-link">
                <Image src="/images/logo.svg" alt="Hackney" width={210} height={40} />
                <span className="lbh-header__logo-text">Hackney</span>
                <span className="lbh-header__service-name">{process.env.NEXT_PUBLIC_NAME}</span>
              </a>
            </Link>
          </h1>
          {user.loggedIn ? (
            <div className="lbh-header__links">
              <p>[username]</p>
              <button onClick={() => dispatch(logOut())}>Sign out</button>
            </div>
          ) : (
            <button onClick={() => dispatch(logIn())}>Sign in</button>
          )}
        </div>
      </div>
    </header>
  )
}