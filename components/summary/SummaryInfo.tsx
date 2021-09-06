import Link from 'next/link';
import React, { ReactNode } from 'react';
import { HeadingThree } from '../content/headings';

interface SummarySectionProps {
  children: ReactNode;
}

export function SummarySection({ children }: SummarySectionProps): JSX.Element {
  return <div className="lbh-summary-section">{children}</div>;
}

interface SummaryTitleProps {
  href: string;
  content: string;
}

export function SummaryTitle({
  href,
  content,
}: SummaryTitleProps): JSX.Element {
  return (
    <div className="lbh-summary-title">
      <HeadingThree content={content} />
      <Link href={href}>
        <a className="lbh-link">Edit</a>
      </Link>
    </div>
  );
}

interface SummaryAnswerProps {
  children: ReactNode;
}

export function SummaryAnswer({ children }: SummaryAnswerProps): JSX.Element {
  return <div className="lbh-summary-answer">{children}</div>;
}
