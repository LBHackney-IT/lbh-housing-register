import { wrapper } from "../lib/store"
import type { AppProps } from "next/app"
import Head from "next/head"
import { FC } from "react"
import "../styles/global.scss"
import Amplify, { Auth } from 'aws-amplify';

//export default function HousingRegisterApp({ Component, pageProps }: AppProps): JSX.Element {
const WrappedApp: FC<AppProps> = ({ Component, pageProps }) => {
  Amplify.configure({
    Auth: {
      region: process.env.NEXT_PUBLIC_AWS_REGION,
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USERPOOL_ID,
      userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
    }
  });

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
