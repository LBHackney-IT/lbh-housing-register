interface ListProps {
  children: JSX.Element | JSX.Element[];
}

export default function List({ children }: ListProps): JSX.Element {
  return <ul className="lbh-list lbh-list--bullet">{children}</ul>;
}

interface ListItemProps {
  children: any;
  bold?: boolean;
}

export const ListItem = ({ children, bold }: ListItemProps): JSX.Element => {
  return <li className={bold ? 'lbh-!-font-weight-bold' : ''}>{children}</li>;
};
