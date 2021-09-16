import { ReactNode } from 'react';

interface PanelProps {
  heading: string;
  children: ReactNode;
}

export default function Panel({ heading, children }: PanelProps): JSX.Element {
  return (
    <div className="govuk-panel govuk-panel--confirmation lbh-panel">
      <h1 className="govuk-panel__title">{heading}</h1>
      <div className="govuk-panel__body">{children}</div>
    </div>
  );
}
