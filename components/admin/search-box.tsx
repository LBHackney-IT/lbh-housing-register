import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface SearchBoxProps {
  title: string;
  watermark: string;
  buttonTitle: string;
}

export default function SearchBox({
  title,
  watermark,
  buttonTitle,
}: SearchBoxProps): JSX.Element {
  const [searchInputValue, setsearchInputValue] = useState('');
  const router = useRouter();

  const textChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): React.ChangeEvent<HTMLInputElement> => {
    setsearchInputValue(event.target.value);
    return event;
  };

  const onSearchSubmit = async () => {
    router.push({
      pathname: '/applications/view-register',
      query: { reference: searchInputValue },
    });
  };

  return (
    <div className="govuk-form-group c-flex">
      <label className="govuk-visually-hidden" htmlFor="input-search">
        Search {title}
      </label>
      <input
        className="govuk-input lbh-input"
        id="input-search"
        name="search"
        type="search"
        placeholder={watermark}
        style={{ height: '50px' }}
        onChange={(e): React.ChangeEvent<HTMLInputElement> =>
          textChangeHandler(e)
        }
      />
      <button
        onClick={onSearchSubmit}
        className="govuk-button lbh-button"
        data-module="govuk-button"
        style={{ marginTop: '0', marginLeft: '1em', maxWidth: '110px' }}
      >
        {buttonTitle}
      </button>
    </div>
  );
}
