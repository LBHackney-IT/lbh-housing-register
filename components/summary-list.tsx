import React from 'react';

interface SummaryListProps {
  children: React.ReactNode;
}
export default function SummaryList({
  children,
}: SummaryListProps): JSX.Element {
  return <dl className="govuk-summary-list lbh-summary-list">{children}</dl>;
}

export const SummaryListSpaced = ({
  children,
}: SummaryListProps): JSX.Element => {
  return (
    <dl className="govuk-summary-list lbh-summary-list lbh-summary-list--spaced">
      {children}
    </dl>
  );
};

export const SummaryListNoBorder = ({
  children,
}: SummaryListProps): JSX.Element => {
  return (
    <dl className="govuk-summary-list govuk-summary-list--no-border lbh-summary-list">
      {children}
    </dl>
  );
};

interface SummaryListKeyProps {
  children?: React.ReactNode;
}
export const SummaryListKey = ({
  children,
}: SummaryListKeyProps): JSX.Element => {
  return <dt className="govuk-summary-list__key">{children}</dt>;
};

interface SummaryListRowProps extends SummaryListProps {
  verticalAlign?: 'bottom' | 'middle';
}
export const SummaryListRow = ({
  children,
  verticalAlign,
}: SummaryListRowProps): JSX.Element => {
  let className = 'govuk-summary-list__row';

  if (verticalAlign) {
    className += ` ${className}__${verticalAlign}`;
  }

  return <div className={className}>{children}</div>;
};

interface SummaryListValueProps {
  children: React.ReactNode;
}
export const SummaryListValue = ({
  children,
}: SummaryListValueProps): JSX.Element => {
  return <dd className="govuk-summary-list__value">{children}</dd>;
};

interface SummaryListActionsProps {
  wideActions?: boolean;
  children: React.ReactNode;
}
export const SummaryListActions = ({
  wideActions,
  children,
}: SummaryListActionsProps): JSX.Element => {
  return (
    <dd
      className={`govuk-summary-list__actions ${
        wideActions ? 'govuk-summary-list__actions--wide' : ''
      }`}
    >
      {children}
    </dd>
  );
};
