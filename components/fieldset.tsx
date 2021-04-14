interface FieldsetProps {
  children: any
}

const Fieldset = ({ children }: FieldsetProps): JSX.Element => (
  <div className="govuk-fieldset lbh-fieldset">
    {children}
  </div>
)

export default Fieldset