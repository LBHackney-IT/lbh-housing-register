interface HeadingTwoProps {
  content: string
}

const HeadingTwo = ({ content }: HeadingTwoProps): JSX.Element => (
  <h2 className="lbh-heading-h2">
    {content}
  </h2>
)

export default HeadingTwo