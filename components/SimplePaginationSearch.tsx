import Link from 'next/link';
import { useRouter } from 'next/router';

interface SimplePaginationSearchProps {
  totalItems: number;
  page: number;
  numberOfItemsPerPage: number;
}

const SimplePaginationSearch = ({
  totalItems,
  page,
  numberOfItemsPerPage,
}: SimplePaginationSearchProps) => {
  const { query } = useRouter();
  const numberOfPages = Math.ceil(totalItems / numberOfItemsPerPage);
  const previousPage = page > 1 ? page - 1 : 1;
  const nextPage = page < numberOfPages ? page + 1 : numberOfPages - 1;

  return (
    <nav className="lbh-simple-pagination">
      {page !== 1 && (
        <Link
          href={{
            query: { ...query, page: previousPage },
          }}
        >
          <a className="lbh-simple-pagination__link">
            <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
              <path d="M10 1L2 9.5L10 18" strokeWidth="2" />
            </svg>
            Previous page
            <span className="lbh-simple-pagination__title">
              {page - 1} of {numberOfPages}
            </span>
          </a>
        </Link>
      )}

      {page !== numberOfPages && numberOfPages > 1 && (
        <Link
          href={{
            query: { ...query, page: nextPage },
          }}
        >
          <a className="lbh-simple-pagination__link lbh-simple-pagination__link--next">
            Next page
            <span className="lbh-simple-pagination__title">
              {page + 1} of {numberOfPages}
            </span>
            <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
              <path d="M1 18L9 9.5L1 1" strokeWidth="2" />
            </svg>
          </a>
        </Link>
      )}
    </nav>
  );
};

export default SimplePaginationSearch;
