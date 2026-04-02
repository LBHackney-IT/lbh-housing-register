import { ReactNode } from 'react';

interface ParagraphProps {
  children: ReactNode | string;
  bold?: boolean;
  dataTestId?: string;
}

export default function Paragraph({
  children,
  bold,
  dataTestId,
}: ParagraphProps): JSX.Element {
  return (
    <p
      className={bold ? 'lbh-body-m lbh-!-font-weight-bold' : 'lbh-body-m'}
      data-testid={dataTestId}
    >
      {children}
    </p>
  );
}
