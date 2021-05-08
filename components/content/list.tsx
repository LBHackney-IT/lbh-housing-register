interface ListProps {
  children: JSX.Element | JSX.Element[]
}

export default function List({ children }: ListProps): JSX.Element {
  return (
    <ul className="lbh-list lbh-list--bullet">
      {children}
    </ul>
  )
}

interface ListItemProps {
  children: any
}

export function ListItem({ children }: ListItemProps): JSX.Element {
  return (
    <li>
      {children}
    </li>
  )
}