interface PanelProps {
  heading: string;
  children: any;
}

export default function Panel({ heading, children }: PanelProps): JSX.Element {
  return (
    <div className="govuk-panel govuk-panel--confirmation lbh-panel">
      <h1 className="govuk-panel__title">{heading}</h1>
      {children}
    </div>
  );
}
