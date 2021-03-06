import Link from 'next/link';

interface BreadcrumbsProps {
  items: { href: string; name: string }[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps): JSX.Element {
  return (
    <div className="govuk-breadcrumbs lbh-breadcrumbs lbh-container">
      <ol className="govuk-breadcrumbs__list">
        {items?.map((item, index, array) => (
          <li key={index} className="govuk-breadcrumbs__list-item">
            {array.length - 1 === index ? (
              item.name
            ) : (
              <Link href={item.href}>
                <a className="govuk-breadcrumbs__link">{item.name}</a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
