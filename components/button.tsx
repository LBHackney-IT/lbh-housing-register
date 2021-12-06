import Link from 'next/link';

interface ButtonProps {
  children: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  secondary?: boolean;
  type?: 'button' | 'reset' | 'submit';
  small?: boolean;
}

export default function Button({
  children,
  className,
  disabled,
  onClick,
  secondary,
  type,
  small,  
}: ButtonProps): JSX.Element {
  className += ' govuk-button lbh-button';

  if (disabled) {
    className += ' govuk-button--disabled lbh-button--disabled';
  }

  if (secondary) {
    className += ' govuk-secondary lbh-button--secondary';
  }

  if (small) {
    className += ' lbh-button--sm';
  }
  
  return (
    <button
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ButtonProps {
  href: string;
  svg?: any;
  additionalCssClasses?: string;  
}

export function ButtonLink({
  children,
  disabled,
  href,
  secondary,
  svg,
  additionalCssClasses,
  small
}: ButtonLinkProps) {
  let className = 'govuk-button lbh-button';

  if (disabled) {
    className += ' govuk-button--disabled lbh-button--disabled';
  }

  if (secondary) {
    className += ' govuk-secondary lbh-button--secondary';
  }

  if (small) {
    className += ' lbh-button--sm';
  }

  return (
    <Link href={href}>
      <a
        className={`${className} ${additionalCssClasses}`}
        draggable="false"
        {...(disabled && `disabled aria-disabled="true"`)}
      >
        <>
          {children}
          {svg}
        </>
      </a>
    </Link>
  );
}
