import Legend from "./Legend"
import "./Fieldset.scss"

interface FieldsetProps {
  children: any
  legend?: string
}

const Fieldset = ({ children, legend }: FieldsetProps): JSX.Element => (
  <div className="govuk-fieldset lbh-fieldset">
    {legend && <Legend content={legend} />}
    {children}
  </div>
)

export default Fieldset