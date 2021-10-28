import Link from 'next/link';

interface NoVisitedLinkProps {
  href: URL;
  isBold?: boolean;
  children: JSX.Element | JSX.Element[];
}

export function NoVisitedLink({
  href,
  isBold,
  children,
}: NoVisitedLinkProps): JSX.Element {
  const cssClasses = isBold
    ? 'lbh-link lbh-link--no-visited-state lbh-!-font-weight-bold'
    : 'lbh-link lbh-link--no-visited-state';
  return (
    <Link href={href}>
      <a className={cssClasses}>{children}</a>
    </Link>
  );
}

interface NoVisitedButtonLinkProps {
  onClick?: () => void;
  isBold?: boolean;
  children: JSX.Element | JSX.Element[];
}

export function NoVisitedButtonLink({
  onClick,
  isBold,
  children,
}: NoVisitedButtonLinkProps): JSX.Element {
  const cssClasses = isBold
    ? 'lbh-link lbh-link--no-visited-state lbh-!-font-weight-bold'
    : 'lbh-link lbh-link--no-visited-state';
  return (
    <button onClick={onClick} className={cssClasses}>
      {children}
    </button>
  );
}
