import Link from "next/link"

interface ButtonProps {
  children: string
  disabled?: boolean
  onClick?: () => void
  secondary?: boolean
  type?: "button" | "reset" | "submit"
}

export default function Button({ children, disabled, onClick, secondary, type }: ButtonProps): JSX.Element {
  let className = "govuk-button lbh-button"

  if (disabled) {
    className += " govuk-button--disabled lbh-button--disabled"
  }

  if (secondary) {
    className += " govuk-secondary lbh-button--secondary"
  }

  return (
    <button
      className={className}
      onClick={onClick}
      type={type}
      {...disabled && `disabled aria-disabled="true"`}>
      {children}
    </button>
  )
}

interface ButtonLinkProps extends ButtonProps {
  href: string
}

export function ButtonLink({ children, disabled, href, secondary }: ButtonLinkProps) {
  let className = "govuk-button lbh-button"

  if (disabled) {
    className += " govuk-button--disabled lbh-button--disabled"
  }

  if (secondary) {
    className += " govuk-secondary lbh-button--secondary"
  }

  return (
    <Link href={href}>
      <a
        className={className}
        draggable="false"
        {...disabled && `disabled aria-disabled="true"`}>
        {children}
      </a>
    </Link>
  )
}