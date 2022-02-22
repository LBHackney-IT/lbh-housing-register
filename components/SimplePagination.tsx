import { useState } from 'react';

interface SimplePaginationProps {
  setPaginationToken: (token: string | null) => void;
  initialPaginationToken?: string | null; // undefined = first page. null = last page, string = somewhere in the middle.
  nextPagePaginationToken: string | null;
}

const SimplePagination = ({
  setPaginationToken,
  initialPaginationToken,
  nextPagePaginationToken,
}: SimplePaginationProps) => {
  // cache pagination token from first render.
  const [initialPaginationIsFirstPage] = useState(
    () => initialPaginationToken !== undefined
  );
  const [paginationTokens, setPaginationTokens] = useState(
    initialPaginationToken !== undefined ? [initialPaginationToken] : []
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
            {paginationTokens.length === 1 && initialPaginationIsFirstPage
              ? 'First page'
              : 'Previous page'}
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
