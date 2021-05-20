interface PanelProps {
  heading: string
  message: string
}

export default function Panel({ heading, message }: PanelProps): JSX.Element {
  return (
    <div className="govuk-panel govuk-panel--confirmation lbh-panel">
      <h1 className="govuk-panel__title">{heading}</h1>
      <div className="govuk-panel__body">{message}</div>
    </div>
  )
}
