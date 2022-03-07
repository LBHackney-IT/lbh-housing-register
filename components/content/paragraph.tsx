import { ReactNode, ReactNodeArray } from 'react';

interface ParagraphProps {
  children: ReactNode | ReactNodeArray | string;
  bold?: boolean;
}

export default function Paragraph({
  children,
  bold,
}: ParagraphProps): JSX.Element {
  return (
    <p className={bold ? 'lbh-body-m lbh-!-font-weight-bold' : 'lbh-body-m'}>
      {children}
    </p>
  );
}
