import HeadingTwo from "../Typography/HeadingTwo"

interface LegendProps {
  content: string
}

const Legend = ({ content }: LegendProps): JSX.Element => (
  <legend className="govuk-fieldset__legend">
    <HeadingTwo content={content} />
  </legend>
)

export default Legend