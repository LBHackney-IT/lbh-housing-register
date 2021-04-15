interface LegendProps {
  children: any
}

export default function Legend({ children }: LegendProps): JSX.Element {
  return (
    <legend className="govuk-fieldset__legend">
      { children }
    </legend>
  )
}