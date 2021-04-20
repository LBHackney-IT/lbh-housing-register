import Link from "next/link"

interface ButtonProps {
  children: string
  href?: string
  type?: "button" | "reset" | "submit"
}

export default function Button({ children, href, type }: ButtonProps): JSX.Element {
  const button = (
    <button className="govuk-button lbh-button" type={type}>
      {children}
    </button>
  )

  if (href) {
    return (
      <Link href={href}>
        {button}
      </Link>
    )
  }

  return button;
}