interface ParagraphProps {
  content: string
}

export default function Paragraph({ content }: ParagraphProps): JSX.Element {
  return (
    <p className="lbh-body-m" dangerouslySetInnerHTML={{ __html: content }} />
  )
}