interface HeadingsProps {
  content: string;
}

export function HeadingOne({ content }: HeadingsProps): JSX.Element {
  return <h1 className="lbh-heading-h1">{content}</h1>;
}

export function HeadingTwo({ content }: HeadingsProps): JSX.Element {
  return <h2 className="lbh-heading-h2">{content}</h2>;
}

export function HeadingThree({ content }: HeadingsProps): JSX.Element {
  return <h3 className="lbh-heading-h3">{content}</h3>;
}
