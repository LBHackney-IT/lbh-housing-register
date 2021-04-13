type ParagraphProps = {
  content: string
}

const Paragraph = ({ content }: ParagraphProps): JSX.Element => (
  <p className="lbh-body-m" dangerouslySetInnerHTML={{ __html: content }} />
)

export default Paragraph