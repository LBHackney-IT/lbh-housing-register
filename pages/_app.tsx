import type { AppProps } from 'next/app'
import Head from "next/head"
import "../styles/global.scss"

export default function HousingRegisterApp({ Component, pageProps }: AppProps): JSX.Element {
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
