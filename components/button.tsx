import Link from 'next/link';

interface ButtonProps {
  children: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  secondary?: boolean;
  type?: 'button' | 'reset' | 'submit';
  dataTestId?: string;
}

export default function Button({
  children,
  className,
  disabled,
  onClick,
  secondary,
  type,
  dataTestId,
}: ButtonProps): JSX.Element {
  className += ' govuk-button lbh-button';

  if (disabled) {
    className += ' govuk-button--disabled lbh-button--disabled';
  }

  if (secondary) {
    className += ' govuk-secondary lbh-button--secondary';
  }

  return (
    <button
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ButtonProps {
  href: string;
  dataTestId?: string;
  svg?: React.SVGProps<SVGSVGElement>;
  additionalCssClasses?: string;
}

export function ButtonLink({
  children,
  disabled,
  href,
  dataTestId,
  secondary,
  svg,
  additionalCssClasses,
}: ButtonLinkProps) {
  let className = 'govuk-button lbh-button';

  if (disabled) {
    className += ' govuk-button--disabled lbh-button--disabled';
  }

  if (secondary) {
    className += ' govuk-secondary lbh-button--secondary';
  }

  return (
    <Link href={href}>
      <a
        className={`${className} ${additionalCssClasses}`}
        data-testid={dataTestId}
        draggable="false"
        {...(disabled && { disabled: true, 'aria-disabled': true })}
      >
        {children}
        {svg}
      </a>
    </Link>
  );
}
