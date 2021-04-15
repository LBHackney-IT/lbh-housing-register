interface FormGroupProps {
  children: any
}

export default function FormGroup({ children }: FormGroupProps): JSX.Element {
  return (
    <div className="govuk-form-group lbh-form-group">
      {children}
    </div>
  )
}