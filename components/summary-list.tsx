interface SummaryListProps {
  children: JSX.Element | JSX.Element[];
}

export default function SummaryList({
  children,
}: SummaryListProps): JSX.Element {
  return (
    <dl className="govuk-summary-list lbh-summary-list">
      {children}
    </dl>
  );
}

export function SummaryListNoBorder({
  children,
}: SummaryListProps): JSX.Element {
  return (
    <dl className="govuk-summary-list govuk-summary-list--no-border lbh-summary-list">
      {children}
    </dl>
  );
}

export function SummaryListActions({
  children,
}: SummaryListProps): JSX.Element {
  return <dd className="govuk-summary-list__actions">{children}</dd>;
}

interface SummaryListKeyProps {
  children: string | JSX.Element;
}
export function SummaryListKey({ children }: SummaryListKeyProps): JSX.Element {
  return <dt className="govuk-summary-list__key">{children}</dt>;
}

interface SummaryListRowProps extends SummaryListProps {
  verticalAlign?: 'bottom' | 'middle';
}
export function SummaryListRow({
  children,
  verticalAlign,
}: SummaryListRowProps): JSX.Element {
  let className = 'govuk-summary-list__row';

  if (verticalAlign) {
    className += ` ${className}__${verticalAlign}`;
  }

  return <div className={className}>{children}</div>;
}

interface SummaryListValueProps {
  children: string | JSX.Element;
}
export function SummaryListValue({
  children,
}: SummaryListValueProps): JSX.Element {
  return <dd className="govuk-summary-list__value">{children}</dd>;
}
