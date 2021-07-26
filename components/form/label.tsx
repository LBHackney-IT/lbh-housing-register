import { ReactNode } from 'react';

interface LabelProps {
  className?: string;
  content: ReactNode;
  htmlFor?: string;
  strong?: boolean;
}

export default function Label({
  className,
  content,
  htmlFor,
  strong,
}: LabelProps): JSX.Element {
  if (strong) {
    content = <strong>{content}</strong>;
  }

  return (
    <label className={`${className} govuk-label lbh-label`} htmlFor={htmlFor}>
      {content}
    </label>
  );
}
