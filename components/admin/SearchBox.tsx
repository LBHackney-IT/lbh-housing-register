import React, { useState } from 'react';

import { useRouter } from 'next/router';

interface SearchBoxProps {
  title: string;
  watermark: string;
  buttonTitle: string;
  dataTestId?: string;
}

export default function SearchBox({
  title,
  watermark,
  buttonTitle,
  dataTestId,
}: SearchBoxProps): JSX.Element {
  const [searchInputValue, setsearchInputValue] = useState('');
  const router = useRouter();

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): React.ChangeEvent<HTMLInputElement> => {
    setsearchInputValue(event.target.value);
    return event;
  };

  const onSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    router.push({
      pathname: '/applications/search-results',
      query: { searchString: searchInputValue, page: '1', pageSize: '10' },
    });
  };

  return (
    <form onSubmit={onSearchSubmit}>
      <div className="govuk-form-group c-flex" data-testid={dataTestId}>
        <label className="govuk-visually-hidden" htmlFor="input-search">
          Search {title}
        </label>
        <input
          className="govuk-input lbh-input lbh-input--large"
          id="input-search"
          name="search"
          type="search"
          placeholder={watermark}
          onChange={(event) => onTextChange(event)}
        />
        <button
          type="submit"
          className="govuk-button lbh-button"
          data-module="govuk-button"
          style={{ marginTop: '0', marginLeft: '1em', maxWidth: '110px' }}
        >
          {buttonTitle}
        </button>
      </div>
    </form>
  );
}
