interface BreadcrumbsProps {
  items: { href: string, name: string }[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps): JSX.Element {
  return (
    <div className="govuk-breadcrumbs lbh-breadcrumbs lbh-container">
      <ol className="govuk-breadcrumbs__list">
        {items?.map((item, index) => (
          <li key={index} className="govuk-breadcrumbs__list-item">
            <a className="govuk-breadcrumbs__link" href={item.href}>
              {item.name}
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}