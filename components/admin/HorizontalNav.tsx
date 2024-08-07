import { SyntheticEvent } from 'react';

interface HorizontalNavProps {
  spaced?: boolean;
  children: JSX.Element | JSX.Element[];
}

export const HorizontalNav = ({
  children,
  spaced,
}: HorizontalNavProps): JSX.Element => {
  return (
    <nav className={`lbh-link-group ${spaced ? 'lbh-link-group--spaced' : ''}`}>
      <ul>{children}</ul>
    </nav>
  );
};

interface HorizontalNavItemProps {
  itemName: string;
  isActive?: boolean;
  children: string;
  handleSelectNavItem: (event: SyntheticEvent) => void;
}

export const HorizontalNavItem = ({
  itemName,
  isActive,
  children,
  handleSelectNavItem,
}: HorizontalNavItemProps): JSX.Element => {
  return (
    <li className="lbh-link-group__item">
      <button
        name={itemName}
        onClick={handleSelectNavItem}
        className={`lbh-link lbh-link--no-visited-state lbh-!-font-weight-bold ${
          isActive ? 'active' : ''
        }`}
      >
        {children}
      </button>
    </li>
  );
};
