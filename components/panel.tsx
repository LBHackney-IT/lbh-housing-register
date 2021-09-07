interface PanelProps {
  heading: string;
  message: string;
  email: string | undefined;
}

export default function Panel({
  heading,
  message,
  email,
}: PanelProps): JSX.Element {
  return (
    <div className="govuk-panel govuk-panel--confirmation lbh-panel">
      <h1 className="govuk-panel__title">{heading}</h1>
      <div className="govuk-panel__body">{message}</div>
      <br />
      <div className="govuk-panel__body">
        We have sent a confirmation email to {email}
      </div>
    </div>
  );
}
