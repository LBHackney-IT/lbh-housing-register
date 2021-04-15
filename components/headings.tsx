interface HeadingsProps {
  content: string
}

export function HeadingOne({ content }: HeadingsProps): JSX.Element {
  return (
    <h1 className="lbh-heading-h1">
      {content}
    </h1>
  )
}

export function HeadingTwo({ content }: HeadingsProps): JSX.Element {
  return (
    <h2 className="lbh-heading-h2">
      {content}
    </h2>
  )
}