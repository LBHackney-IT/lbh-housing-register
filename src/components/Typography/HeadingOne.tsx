type HeadingOneProps = {
  content: string
}

const HeadingOne = ({ content }: HeadingOneProps): JSX.Element => (
  <h1 className="lbh-heading-h1">
    {content}
  </h1>
)

export default HeadingOne