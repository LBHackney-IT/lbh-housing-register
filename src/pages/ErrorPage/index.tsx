import { StatusCode } from "react-http-status-code";

type ErrorPageProps = {
  children: JSX.Element
  statusCode?: number
}

const ErrorPage = ({ children, statusCode }: ErrorPageProps): JSX.Element => {
  statusCode = statusCode || 500

  return (
    <StatusCode code={statusCode}>
      {children}
    </StatusCode>
  )
}

export default ErrorPage