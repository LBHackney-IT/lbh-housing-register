import "./InsetText.scss"

type InsetTextProps = {
  content: string
}

const InsetText = ({ content }: InsetTextProps): JSX.Element => (
  <div className="govuk-inset-text lbh-inset-text" dangerouslySetInnerHTML={{ __html: content }} />
)

export default InsetText