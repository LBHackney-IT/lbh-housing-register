interface HeadingsProps {
  content: string;
}

export const HeadingOne = ({ content }: HeadingsProps): JSX.Element => {
  return <h1 className="lbh-heading-h1">{content}</h1>;
};

export const HeadingTwo = ({ content }: HeadingsProps): JSX.Element => {
  return <h2 className="lbh-heading-h2">{content}</h2>;
};

export const HeadingThree = ({ content }: HeadingsProps): JSX.Element => {
  return <h3 className="lbh-heading-h3">{content}</h3>;
};

export const HeadingFour = ({ content }: HeadingsProps): JSX.Element => {
  return <h4 className="lbh-heading-h4">{content}</h4>;
};
