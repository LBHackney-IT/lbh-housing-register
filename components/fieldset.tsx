interface FieldsetProps {
  children: any
}

export default function Fieldset({ children }: FieldsetProps): JSX.Element {
  return (
    <div className="govuk-fieldset lbh-fieldset">
      {children}
    </div>
  )
}