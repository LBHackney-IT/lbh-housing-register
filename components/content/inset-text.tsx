import { ReactNode } from 'react';

interface InsetTextProps {
  children: ReactNode;
}

export default function InsetText({ children }: InsetTextProps): JSX.Element {
  return <div className="govuk-inset-text lbh-inset-text">{children}</div>;
}
