import React from 'react';

interface SearchBoxProps {
  title: string;
  watermark: string;
  buttonTitle: string;
  onSearch: () => void;
  textChangeHandler: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => React.ChangeEvent<HTMLInputElement>;
}

export default function SearchBox({
  title,
  watermark,
  buttonTitle,
  onSearch,
  textChangeHandler,
}: SearchBoxProps): JSX.Element {
  return (
    <div className="govuk-form-group c-flex">
      <label className="govuk-visually-hidden" htmlFor="input-search">Search {title}</label>
      <input
        className="govuk-input lbh-input"
        id="input-search"
        name="search"
        type="search"
        placeholder={watermark}
        style={{height: '50px'}}
        onChange={(e): React.ChangeEvent<HTMLInputElement> =>
          textChangeHandler(e)
        }
      />
      <button
        onClick={onSearch}
        className="govuk-button lbh-button"
        data-module="govuk-button"
        style={{marginTop: '0', marginLeft: '1em', maxWidth: '110px'}}
      >
        {buttonTitle}
      </button>
    </div>
  );
}
