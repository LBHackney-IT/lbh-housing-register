import router, { useRouter } from 'next/router';
import React from 'react';

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
  const [currentPage, setCurrentPage] = React.useState(page);

  const numberOfPages = Math.ceil(totalItems / numberOfItemsPerPage);
  console.log({ totalItems, numberOfItemsPerPage, numberOfPages });

  const pages = Array.from(Array(numberOfPages).keys());
  const previousPage = currentPage > 0 ? currentPage - 1 : 0;
  const nextPage =
    currentPage < numberOfPages ? currentPage + 1 : numberOfPages - 1;

  console.log({
    pages,
    numberOfPages,
    currentPage,
    previousPage,
    nextPage,
  });

  const handlePrevClick = () => {
    setCurrentPage(previousPage);
    query.page = currentPage.toString();
    router.push({
      pathname: '/applications/search-results',
      query,
    });
  };

  const handleNextClick = () => {
    setCurrentPage(nextPage);
    query.page = currentPage.toString();
    router.push({
      pathname: '/applications/search-results',
      query,
    });
  };

  return (
    <nav className="lbh-simple-pagination">
      {previousPage !== 0 && (
        <a
          href="#previous"
          onClick={handlePrevClick}
          className="lbh-simple-pagination__link"
        >
          <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
            <path d="M10 1L2 9.5L10 18" strokeWidth="2" />
          </svg>
          Previous page
          <span className="lbh-simple-pagination__title">
            {currentPage - 1} of {numberOfPages}
          </span>
        </a>
      )}

      {currentPage + 1 !== numberOfPages && numberOfPages > 1 && (
        <a
          href="#next"
          onClick={handleNextClick}
          className="lbh-simple-pagination__link lbh-simple-pagination__link--next"
        >
          Next page
          <span className="lbh-simple-pagination__title">
            {currentPage + 1} of {numberOfPages}
          </span>
          <svg width="11" height="19" viewBox="0 0 11 19" fill="none">
            <path d="M1 18L9 9.5L1 1" strokeWidth="2" />
          </svg>
        </a>
      )}
    </nav>
  );
};

export default SimplePaginationSearch;
