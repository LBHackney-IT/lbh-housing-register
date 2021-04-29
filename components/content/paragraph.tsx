interface ParagraphProps {
  children: any
}

export default function Paragraph({ children }: ParagraphProps): JSX.Element {
  return (
    <p className="lbh-body-m">
      {children}
    </p>
  )
}