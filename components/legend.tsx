interface LegendProps {
  children: any
}

const Legend = ({ children }: LegendProps): JSX.Element => (
  <legend className="govuk-fieldset__legend">
    { children }
  </legend>
)

export default Legend