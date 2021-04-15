import Link from "next/link"

interface ButtonProps {
  children: string
  to: string
}

const Button = ({ children, to }: ButtonProps): JSX.Element => (
  <Link href={to}>
    <button className="govuk-button lbh-button">
      {children}
    </button>
  </Link>
)

export default Button