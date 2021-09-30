import { ReactNode } from 'react';

interface LabelProps {
  className?: string;
  content: ReactNode;
  htmlFor?: string;
  strong?: boolean;
  hideLabel?: boolean;
}

export default function Label({
  className,
  content,
  htmlFor,
  strong,
  hideLabel,
}: LabelProps): JSX.Element {
  if (strong) {
    content = <strong>{content}</strong>;
  }
  if (hideLabel) {
    className += ' govuk-visually-hidden';
  }

  return (
    <label className={`${className} govuk-label lbh-label`} htmlFor={htmlFor}>
      {content}
    </label>
  );
}
