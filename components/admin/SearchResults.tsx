import React from 'react';

import { PaginatedSearchResultsResponse } from '../../domain/HousingApi';
import Paragraph from '../content/paragraph';
import ApplicationsTable from '../../components/admin/ApplicationsTable';
import SimplePaginationSearch from '../SimplePaginationSearch';
interface SearchResultsProps {
  applications: PaginatedSearchResultsResponse | null;
}

const SearchResults = ({ applications }: SearchResultsProps): JSX.Element => {
  return (
    <>
      {applications ? (
        <>
          {applications.totalResults !== 0 ? (
            <>
              <ApplicationsTable
                applications={applications}
                showStatus={true}
              />

              <SimplePaginationSearch
                totalItems={applications.totalResults}
                page={applications.page}
                numberOfItemsPerPage={applications.pageSize}
              />
            </>
          ) : (
            <Paragraph>No applications to show</Paragraph>
          )}
        </>
      ) : null}
    </>
  );
};

export default SearchResults;
