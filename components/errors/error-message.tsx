
interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps): JSX.Element {
  return (
    <span className="govuk-error-message lbh-error-message">
      <span className="govuk-visually-hidden">Error:</span> {message}
    </span>
  );
}
