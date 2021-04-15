interface LabelProps {
  className?: string
  content: string
  htmlFor?: string
}

export default function Label({ className, content, htmlFor }: LabelProps): JSX.Element {
  return (
    <label className={`${className} govuk-label lbh-label`} htmlFor={htmlFor}>
      {content}
    </label>
  )
}