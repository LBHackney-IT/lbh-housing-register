interface InsetTextProps {
  children: JSX.Element;
}

export default function InsetText({ children }: InsetTextProps): JSX.Element {
  return <div className="govuk-inset-text lbh-inset-text">{children}</div>;
}
