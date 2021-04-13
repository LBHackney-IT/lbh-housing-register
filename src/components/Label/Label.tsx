import "./Label.scss"

interface LabelProps {
  className?: string
  content: string
  htmlFor?: string
}

const Label = ({ className, content, htmlFor }: LabelProps): JSX.Element => (
  <label className={`${className} govuk-label lbh-label`} htmlFor={htmlFor}>
    {content}
  </label>
)

export default Label