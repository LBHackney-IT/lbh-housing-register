interface FormGroupProps {
  children: any
}
const FormGroup = ({ children }: FormGroupProps): JSX.Element => (
  <div className="govuk-form-group lbh-form-group">
    {children}
  </div>
)

export default FormGroup