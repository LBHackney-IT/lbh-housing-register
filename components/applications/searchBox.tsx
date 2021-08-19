import React, { ChangeEvent } from 'react';

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
    <div className="govuk-form-group lbh-form-group">
      <label className="govuk-label lbh-label" htmlFor="input-search">
        {title}
      </label>
      <input
        className="govuk-input lbh-input"
        id="input-search"
        name="test-name"
        type="text"
        placeholder={watermark}
        onChange={(e): React.ChangeEvent<HTMLInputElement> =>
          textChangeHandler(e)
        }
      />
      <button
        onClick={onSearch}
        className="govuk-button lbh-button"
        data-module="govuk-button"
      >
        {buttonTitle}
      </button>
    </div>
  );
}
