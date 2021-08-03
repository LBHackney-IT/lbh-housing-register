import Link from "next/link";
import React from "react";
import { ApplicantWithPersonID } from "../../lib/store/applicant";
import { normalizeString, retrieveQuestionName } from "../../lib/utils/summary";
import { SummaryListActions, SummaryListNoBorder, SummaryListRow, SummaryListValue } from "../summary-list";

interface CurrentAccommodationSummaryProps {
  currentResident: ApplicantWithPersonID;
  data: any;
}

export function CurrentAccommodationSummary({ currentResident, data }: CurrentAccommodationSummaryProps) {
  const formulator = (question: any) => {
    if (retrieveQuestionName(question) === 'living-situation') {
      switch (normalizeString(question['answer'])) {
        case 'livingwithparents':
          return 'with parents';
        case 'livingwithfriends':
          return 'with friends';
        case 'livingwithrelatives':
          return 'with relatives';
        case 'temporaryaccommodation':
          return 'temporary accommodation';
        case 'privaterental':
          return 'private rental';
        case 'owneroccupier':
          return 'owner occupier';
        case 'nofixedabode':
          return 'no fixed abode';
        case 'squatter':
          return 'squatter';
        case 'unauthorisedoccupant':
          return 'unauthorised occupant';
        case 'tiedaccommodation':
          return 'tied accommodation';
      }
    }

    if (retrieveQuestionName(question) === 'home') {
      switch (normalizeString(question['answer'])) {
        case 'house':
          return 'house';
        case 'flat':
          return 'flat';
        case 'flataboveshop':
          return 'flat above shop';
        case 'maisonnette':
          return 'maisonnette';
        case 'bungalow':
          return 'bungalow';
        case 'hotelhostel':
          return 'hotel hostel';
        case 'boat':
          return 'boat';
        case 'caravan':
          return 'caravan';
        case 'studio':
          return 'studio';
        case 'other':
          return 'other';
      }
    }

    if (retrieveQuestionName(question) === 'home-floor') {
      return question['answer'];
    }

    if (retrieveQuestionName(question) === 'home-how-many-people-share') {
      return question['answer'];
    }
  };

  return (
    <>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <SummaryListNoBorder>
          <SummaryListRow>
            <SummaryListValue>
              <h3 className="lbh-heading-h3">Current Accommodation</h3>
            </SummaryListValue>
            <SummaryListActions>
              <Link href={`/apply/${currentResident.person.id}/current-accommodation`}>
                Edit
              </Link>
            </SummaryListActions>
          </SummaryListRow>
        </SummaryListNoBorder>
        <p className="lbh-body-m">
          I am living <strong>{formulator(data[0])}</strong>
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          I live in a <strong>{formulator(data[1])}</strong>
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home is on floor <strong>{formulator(data[2])}</strong>
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          I share my home with <strong>{formulator(data[3])}</strong> people not
          included in this application
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home has <strong>{data[4]['answer']}</strong> bedroom(s)
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home has <strong>{data[5]['answer']}</strong> bathrooms
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home has <strong>{data[6]['answer']}</strong> kitchen
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          My home has <strong>{data[7]['answer']}</strong> other rooms
        </p>
      </div>
      <div style={{ borderBottom: '1px solid', color: '#b1b4b6' }}>
        <p className="lbh-body-m">
          I have <strong>{data[8]['answer']}</strong> rooms for my own personal
          use
        </p>
      </div>
    </>
  );
}
