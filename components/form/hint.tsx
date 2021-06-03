interface HintProps {
  className?: string;
  content: string;
}

export default function Hint({ className, content }: HintProps): JSX.Element {
  return <span className={`${className} govuk-hint lbh-hint`}>{content}</span>;
}
