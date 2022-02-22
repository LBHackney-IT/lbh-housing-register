import { useState } from 'react';

interface SimplePaginationProps {
  setPaginationToken: (token: string) => void;
  initialPaginationToken?: string;
  nextPagePaginationToken: string;
}

const SimplePagination = ({
  setPaginationToken,
  initialPaginationToken,
  nextPagePaginationToken,
}: SimplePaginationProps) => {
  const [paginationTokens, setPaginationTokens] = useState(
    initialPaginationToken ? [initialPaginationToken] : []
  );

  const handleNextClick = () => {
    setPaginationToken(nextPagePaginationToken);
    setPaginationTokens([...paginationTokens, nextPagePaginationToken]);
  };

  const handlePreviousClick = () => {
    setPaginationToken(paginationTokens[paginationTokens.length - 2]);
    setPaginationTokens(paginationTokens.slice(0, -1));
  };

  return (
    <>
      <nav className="lbh-simple-pagination">
        {paginationTokens.length > 0 && (
          // TODO use <button>
          <a
            className="lbh-simple-pagination__link"
            onClick={handlePreviousClick}
            href="#"
          >
            <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
              <path d="M10 1L2 9.5L10 18" strokeWidth="2" />
            </svg>
            Previous page
          </a>
        )}

        {nextPagePaginationToken && (
          // TODO use <button>
          <a
            className="lbh-simple-pagination__link lbh-simple-pagination__link--next"
            onClick={handleNextClick}
            href="#"
          >
            Next page
            <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
              <path d="M1 18L9 9.5L1 1" strokeWidth="2" />
            </svg>
          </a>
        )}
      </nav>
    </>
  );
};

export default SimplePagination;
