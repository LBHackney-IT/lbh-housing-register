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
  // const pages = Array.from(Array(numberOfPages).keys());
  // const currentPage = Math.floor(page / numberOfItemsPerPage);
  // const previousPage = currentPage > 0 ? currentPage - 1 : 0;
  // const nextPage =
  //   currentPage < numberOfPages - 1 ? currentPage + 1 : numberOfPages - 1;
  // const previousPageUrl = `${pageUrl}&page=${previousPage}`;
  // const nextPageUrl = `${pageUrl}&page=${nextPage}`;
  // const firstPageUrl = `${pageUrl}&page=0`;
  // const lastPageUrl = `${pageUrl}&page=${numberOfPages - 1}`;

  // console.log({
  //   numberOfPages,
  //   pages,
  //   currentPage,
  //   previousPage,
  //   nextPage,
  //   previousPageUrl,
  //   nextPageUrl,
  //   firstPageUrl,
  //   lastPageUrl,
  // });

  var paginationItems = [];
  for (var i = 0; i < numberOfPages; i++) {
    query.page = i.toString();
    const newRelativePathQuery = `${pathname}?page=${query.page}&pageSize=${query.pageSize}&searchString=${query.searchString}`;

    // console.log({ newRelativePathQuery });

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
        {/* Showing {pageStartOffSet}—{pageEndOffSet} of {totalItems} results */}
        Showing {totalItems} results
      </div>
      <ul className="lbh-pagination">{paginationItems}</ul>
    </nav>
  );
};

export default Pagination;
