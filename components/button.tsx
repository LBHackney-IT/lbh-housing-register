import Link from "next/link"

interface ButtonProps {
  children: string
  to: string
}

export default function Button ({ children, to }: ButtonProps): JSX.Element {
  return (
    <Link href={to}>
      <button className="govuk-button lbh-button">
        {children}
      </button>
    </Link>
  )
}