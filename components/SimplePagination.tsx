import Link from 'next/link';

interface SimplePaginationProps {
  totalItems: number;
  page: number;
  totalNumberOfPages: number;
  numberOfItemsPerPage: number;
  pageStartOffSet: number;
  pageEndOffSet: number;
  pageUrl: string;
}

const SimplePagination = ({
  totalItems,
  page,
  totalNumberOfPages,
  pageStartOffSet,
  pageEndOffSet,
  pageUrl,
}: SimplePaginationProps) => {
  const previousPageUrl = new URL(pageUrl);
  previousPageUrl.searchParams.append('page', (page - 1).toString());

  const nextPageUrl = new URL(pageUrl);
  nextPageUrl.searchParams.append('page', (page + 1).toString());

  return (
    <>
      <div className="lbh-body">
        Showing {pageStartOffSet}—{pageEndOffSet} of {totalItems} results
      </div>
      <nav className="lbh-simple-pagination">
        {page !== 1 ? (
          <Link href={previousPageUrl.toString()}>
            <a className="lbh-simple-pagination__link">
              <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
                <path d="M10 1L2 9.5L10 18" strokeWidth="2" />
              </svg>
              Previous page
              <span className="lbh-simple-pagination__title">
                {' '}
                {page - 1} of {totalNumberOfPages}{' '}
              </span>
            </a>
          </Link>
        ) : null}
        {page !== totalNumberOfPages ? (
          <Link href={nextPageUrl.toString()}>
            <a className="lbh-simple-pagination__link lbh-simple-pagination__link--next">
              Next page
              <span className="lbh-simple-pagination__title">
                {' '}
                {page + 1} of {totalNumberOfPages}{' '}
              </span>
              <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
                <path d="M1 18L9 9.5L1 1" strokeWidth="2" />
              </svg>
            </a>
          </Link>
        ) : null}
      </nav>
    </>
  );
};

export default SimplePagination;