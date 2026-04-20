import type { ReactNode } from 'react';
import { HeadingThree } from './content/headings';

interface TimelineProps {
  children: ReactNode;
}

export default function Timeline({ children }: TimelineProps): JSX.Element {
  return <ol className="lbh-timeline">{children}</ol>;
}

interface TimelineEventProps {
  heading: string;
  children?: ReactNode;
  variant?: 'action-needed' | 'major' | 'minor';
}

export function TimelineEvent({
  heading,
  children,
  variant,
}: TimelineEventProps): JSX.Element {
  let className = 'lbh-timeline__event';
  if (variant) {
    className += ' lbh-timeline__event--' + variant;
  }

  return (
    <li className={className}>
      <HeadingThree content={heading} />
      {children}
    </li>
  );
}
