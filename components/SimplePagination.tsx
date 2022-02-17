import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SimplePaginationProps {
  totalItems: number;
  pageUrl: string;
  currentPagePaginationToken: string;
  nextPagePaginationToken: string;
}

const SimplePagination = ({
  totalItems,
  pageUrl,
  currentPagePaginationToken,
  nextPagePaginationToken,
}: SimplePaginationProps) => {
  const [paginationTokenArray, setPaginationTokenArray] = useState([
    currentPagePaginationToken,
  ]);

  const handleNextClick = () => {
    setPaginationTokenArray([
      ...paginationTokenArray,
      currentPagePaginationToken,
    ]);
  };

  // TODO handlePreviousClick

  const previousPageUrl = new URL(pageUrl);
  previousPageUrl.searchParams.append(
    'paginationToken',
    paginationTokenArray[paginationTokenArray.length - 1]
  );

  const nextPageUrl = new URL(pageUrl);
  nextPageUrl.searchParams.append(
    'paginationToken',
    nextPagePaginationToken.toString()
  );

  return (
    <>
      <div className="lbh-body">Showing {totalItems} results</div>
      <nav className="lbh-simple-pagination">
        {currentPagePaginationToken !== '' ? (
          <Link href={previousPageUrl.toString()}>
            <a className="lbh-simple-pagination__link">
              <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
                <path d="M10 1L2 9.5L10 18" strokeWidth="2" />
              </svg>
              Previous page
              {/* <span className="lbh-simple-pagination__title"> {page - 1}</span> */}
            </a>
          </Link>
        ) : null}

        <Link href={nextPageUrl.toString()}>
          <a
            className="lbh-simple-pagination__link lbh-simple-pagination__link--next"
            onClick={handleNextClick}
          >
            Next page
            {/* <span className="lbh-simple-pagination__title"> {page + 1}</span> */}
            <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
              <path d="M1 18L9 9.5L1 1" strokeWidth="2" />
            </svg>
          </a>
        </Link>
      </nav>
    </>
  );
};

export default SimplePagination;
