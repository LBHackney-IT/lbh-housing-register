interface PaginationItemProps {
  page: number;
  pageUrl: URL;
  isCurrent: boolean;
}

const PaginationItem = ({ page, pageUrl, isCurrent }: PaginationItemProps) => {
  return (
    <li className="lbh-pagination__item">
      <a
        className={`lbh-pagination__link lbh-pagination__link${
          isCurrent ? '--current' : ''
        }`}
        href={`${pageUrl.href}`}
        aria-current={isCurrent}
        aria-label={`Page ${page}, ${isCurrent ? 'current page' : ''}`}
      >
        {page}
      </a>
    </li>
  );
};

interface PaginationProps {
  totalItems: number;
  page: number;
  totalNumberOfPages: number;
  numberOfItemsPerPage: number;
  pageStartOffSet: number;
  pageEndOffSet: number;
  pageUrl: string;
  parameters: URLSearchParams;
}

const Pagination = ({
  totalItems,
  page,
  totalNumberOfPages,
  pageStartOffSet,
  pageEndOffSet,
  pageUrl,
  parameters,
}: PaginationProps) => {
  var paginationItems = [];
  for (var i = 1; i <= totalNumberOfPages; i++) {
    const urlWithParams = new URL(pageUrl);
    urlWithParams.searchParams.append('page', i.toString());

    if (Array.from(parameters).length > 0) {
      for (var pair of parameters.entries()) {
        urlWithParams.searchParams.append(pair[0], pair[1]);
      }
    }

    paginationItems.push(
      <PaginationItem
        key={i}
        page={i}
        isCurrent={i == page}
        pageUrl={urlWithParams}
      />
    );
  }

  return (
    <nav className="lbh-pagination">
      <div className="lbh-pagination__summary">
        Showing {pageStartOffSet}—{pageEndOffSet} of {totalItems} results
      </div>
      <ul className="lbh-pagination">{paginationItems}</ul>
    </nav>
  );
};

export default Pagination;
