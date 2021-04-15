interface InsetTextProps {
  content: string
}

export default function InsetText({ content }: InsetTextProps): JSX.Element {
  return (
    <div className="govuk-inset-text lbh-inset-text" dangerouslySetInnerHTML={{ __html: content }} />
  )
}