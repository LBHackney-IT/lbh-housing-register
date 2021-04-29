import { ReactNode, ReactNodeArray } from "react";

interface ParagraphProps {
  children: ReactNode | ReactNodeArray | string
}

export default function Paragraph({ children }: ParagraphProps): JSX.Element {
  return (
    <p className="lbh-body-m">
      {children}
    </p>
  )
}