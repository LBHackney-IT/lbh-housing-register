import { HeadingThree } from './content/headings';

interface TimelineProps {
  children: JSX.Element | JSX.Element[];
}

export default function Timeline({ children }: TimelineProps): JSX.Element {
  return <ol className="lbh-timeline">{children}</ol>;
}

interface TimelineEventProps {
  heading: string;
  children: JSX.Element | JSX.Element[];
  variant?: 'action-needed' | 'major' | 'minor';
}

export const TimelineEvent = ({
  heading,
  children,
  variant,
}: TimelineEventProps): JSX.Element => {
  let className = 'lbh-timeline__event';
  if (variant) {
    className += ` lbh-timeline__event--${variant}`;
  }

  return (
    <li className={className}>
      <HeadingThree content={heading} />
      {children}
    </li>
  );
};
