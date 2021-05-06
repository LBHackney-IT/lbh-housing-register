import { wrapper } from "../lib/store"
import type { AppProps } from "next/app"
import Head from "next/head"
import { FC } from "react"
import "../styles/global.scss"

//export default function HousingRegisterApp({ Component, pageProps }: AppProps): JSX.Element {
const WrappedApp: FC<AppProps> = ({Component, pageProps}) => {
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_NAME} | Hackney Council</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <>
        <Component {...pageProps} />
      </>
    </>
  )
}

export default wrapper.withRedux(WrappedApp)