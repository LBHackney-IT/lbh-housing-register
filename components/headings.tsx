interface HeadingsProps {
  content: string
}

export const HeadingOne = ({ content }: HeadingsProps): JSX.Element => (
  <h1 className="lbh-heading-h1">
    {content}
  </h1>
)

export const HeadingTwo = ({ content }: HeadingsProps): JSX.Element => (
  <h1 className="lbh-heading-h1">
    {content}
  </h1>
)