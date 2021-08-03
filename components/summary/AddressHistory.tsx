import Link from "next/link";
import React from "react";
import { ApplicantWithPersonID } from "../../lib/store/applicant";
import { SummaryListActions, SummaryListNoBorder, SummaryListRow, SummaryListValue } from "../summary-list";

interface AddressHistorySummaryProps {
  currentResident: ApplicantWithPersonID;
  data: any;
}

export function AddressHistorySummary({ currentResident, data }: AddressHistorySummaryProps) {

  const getSpecificDates = (date: Date) => {
    const dateObj = new Date(date);
    return {
      month: dateObj.toLocaleString('default', { month: 'long' }),
      year: dateObj.toLocaleString('default', { year: 'numeric' }),
    };
  };

  // TODO: this needs some better checks if no address provided
  const addressHistory = data[0]['answer'];

  return (
    <>
      <SummaryListNoBorder>
        <SummaryListRow>
          <SummaryListValue>
            <h3 className="lbh-heading-h3">Address history</h3>
          </SummaryListValue>
          <SummaryListActions>
            <Link href={`/apply/${currentResident.person.id}/address-history`}>
              Edit
            </Link>
          </SummaryListActions>
        </SummaryListRow>
      </SummaryListNoBorder>
      {addressHistory && JSON.parse(addressHistory).map((address: any, index: any) => {
        return (
          <>
            <div
              key={index}
              style={{
                borderBottom: '1px solid',
                color: '#b1b4b6',
              }}
            >
              <p className="lbh-body-m">
                {index === 0 ? 'Current Address' : 'Previous Address'}
              </p>
              <p className="lbh-body-m">
                <strong>
                  {address['address']['line1']}, {address['address']['town']},{' '}
                  {address['postcode']}
                </strong>
              </p>
              <p className="lbh-body-m">
                From{' '}
                <strong>
                  {getSpecificDates(address['date'])['month']}{' '}
                  {getSpecificDates(address['date'])['year']}{' '}
                  {index !== 0
                    ? `to ${getSpecificDates(
                      JSON.parse(data[0]['answer'])[index - 1]['date']
                    )['month']
                    } ${' '} ${getSpecificDates(
                      JSON.parse(data[0]['answer'])[index - 1]['date']
                    )['year']
                    }`
                    : ``}
                </strong>
              </p>
            </div>
          </>
        );
      })}
    </>
  );
}
