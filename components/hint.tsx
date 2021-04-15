interface HintProps {
  className?: string
  content: string
}

const Hint = ({ className, content }: HintProps): JSX.Element => (
  <span className={`${className} govuk-hint lbh-hint`}>
    {content}
  </span>
)

export default Hint