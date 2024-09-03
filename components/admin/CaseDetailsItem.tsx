import React from 'react';

import { HeadingFour } from '../content/headings';

interface CaseDetailsProps {
  itemHeading: string;
  itemValue: string | undefined;
  buttonText?: string;
  dataTestId?: string;
  onClick?: () => void;
}

export default function CaseDetailsItem({
  itemHeading,
  itemValue,
  buttonText,
  onClick,
  dataTestId,
}: CaseDetailsProps): JSX.Element {
  return (
    <>
      <HeadingFour content={itemHeading} />
      <p className="lbh-body-m lbh-!-margin-top-0">{itemValue}</p>
      {buttonText ? (
        <button
          onClick={onClick}
          className="lbh-link lbh-link--no-visited-state lbh-!-margin-top-0"
          data-testid={dataTestId}
        >
          {buttonText}
        </button>
      ) : null}
    </>
  );
}
