interface PaginationItemProps {
  page: number;
  pageurl: URL;
  isCurrrent: boolean;
}

const PaginationItem = ({ page, pageurl, isCurrrent }: PaginationItemProps) => {
  return (
    <li className="lbh-pagination__item">
      <a
        className={`lbh-pagination__link lbh-pagination__link${
          isCurrrent ? '--current' : ''
        }`}
        href={`${pageurl.href}`}
        aria-current={isCurrrent}
        aria-label={`Page ${page}, ${isCurrrent ? 'current page' : ''}`}
      >
        {page}
      </a>
    </li>
  );
};

interface PageinationProps {
  totalItems: number;
  page: number;
  totalNumberOfPages: number;
  numberOfItemsPerPage: number;
  pageStartOffSet: number;
  pageEndOffSet: number;
  pageurl: string;
  parameters: URLSearchParams;
}

const Pagination = ({
  totalItems,
  page,
  totalNumberOfPages,
  pageStartOffSet,
  pageEndOffSet,
  pageurl,
  parameters,
}: PageinationProps) => {
  var paginationItems = [];
  for (var i = 1; i <= totalNumberOfPages; i++) {
    const urlWithParams = new URL(pageurl);

    urlWithParams.searchParams.append('page', i.toString());

    //alert(parameters);

    if (Array.from(parameters).length > 0) {
      for (var pair of parameters.entries()) {
        urlWithParams.searchParams.append(pair[0], pair[1]);
      }
    }

    paginationItems.push(
      <PaginationItem
        key={i}
        page={i}
        isCurrrent={i == page}
        pageurl={urlWithParams}
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
