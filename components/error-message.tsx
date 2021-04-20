interface ErrorMessageProps {
  message: string | object
}

export default function ErrorMessage({ message }: ErrorMessageProps): JSX.Element | null {
  if (typeof(message) === "string") {
    return (
      <div className="govuk-error-message lbh-error-message">
        <span className="govuk-visually-hidden">Error:</span>
        {message}
      </div>
    )
  }

  return null;
}