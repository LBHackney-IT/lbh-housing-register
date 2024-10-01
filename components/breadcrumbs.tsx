import Link from 'next/link';

export interface BreadcrumbItem {
  id: string;
  href: string;
  name: string;
}
export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({
  items,
}: Readonly<BreadcrumbsProps>): JSX.Element {
  return (
    <div className="govuk-breadcrumbs lbh-breadcrumbs lbh-container">
      <ol className="govuk-breadcrumbs__list">
        {items?.map((item, index, array) => (
          <li key={item.id} className="govuk-breadcrumbs__list-item">
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
