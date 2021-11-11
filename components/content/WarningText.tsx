import { ReactNode, ReactNodeArray } from 'react';

interface WarningTextProps {
  children: ReactNode | ReactNodeArray | string;
}

export default function WarningText({
  children,
}: WarningTextProps): JSX.Element {
  return (
    <div className="govuk-warning-text lbh-warning-text">
      <span className="govuk-warning-text__icon" aria-hidden="true">
        !
      </span>
      <strong className="govuk-warning-text__text">
        <span className="govuk-warning-text__assistive">Warning</span>
        {children}
      </strong>
    </div>
  );
}
