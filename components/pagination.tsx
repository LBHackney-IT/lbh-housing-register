import Link from 'next/link';
import { useRouter } from 'next/router';

interface PaginationItemProps {
  page: number;
  pageUrl: string;
  isCurrent: boolean;
}

const PaginationItem = ({ page, pageUrl, isCurrent }: PaginationItemProps) => {
  return (
    <li className="lbh-pagination__item">
      <Link href={pageUrl}>
        <a
          className={`lbh-pagination__link lbh-pagination__link${
            isCurrent ? '--current' : ''
          }`}
          aria-current={isCurrent}
          aria-label={`Page ${page}, ${isCurrent ? 'current page' : ''}`}
        >
          {page + 1}
        </a>
      </Link>
    </li>
  );
};

interface PaginationProps {
  totalItems: number;
  page: number;
  numberOfItemsPerPage: number;
  pageUrl: string | undefined;
}

const Pagination = ({
  totalItems,
  page,
  numberOfItemsPerPage,
  pageUrl,
}: PaginationProps) => {
  const { query, pathname } = useRouter();
  const numberOfPages = Math.ceil(totalItems / numberOfItemsPerPage);

  const paginationItems = [];
  for (let i = 0; i < numberOfPages; i++) {
    query.page = i.toString();
    const newRelativePathQuery = `${pathname}?page=${query.page}&pageSize=${query.pageSize}&searchString=${query.searchString}`;

    paginationItems.push(
      <PaginationItem
        key={i}
        page={i}
        isCurrent={i == page}
        pageUrl={newRelativePathQuery}
      />
    );
  }

  return (
    <nav className="lbh-pagination">
      <div className="lbh-pagination__summary">
        Showing {totalItems} results
      </div>
      <ul className="lbh-pagination">{paginationItems}</ul>
    </nav>
  );
};

export default Pagination;
