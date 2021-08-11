import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { useRouter } from 'next/router';
import { ButtonLink } from '../../components/button';
import { HeadingOne } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import DeleteLink from '../../components/delete-link';
import Announcement from '../../components/announcement';
import { signOut } from '../../lib/store/cognitoUser';
import { Applicant } from '../../domain/HousingApi';
import { calculateBedrooms } from '../../lib/utils/bedroomCalculator';
import { useState, useEffect } from 'react';
import { getGenderName } from '../../lib/utils/gender';
import { getAgeInYears } from '../../lib/utils/dateOfBirth';
import { getWaitingTime } from '../../lib/utils/bedroomWaitingTime';

const WhatToExpect = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onCancel = () => {
    dispatch(signOut());
    router.push('/');
  };

  const applicants = useAppSelector((store) =>
    [store.application.mainApplicant, store.application.otherMembers]
      .filter((v): v is Applicant | Applicant[] => v !== undefined)
      .flat()
  );

  const bedroomArray = applicants.map((individual) => {
    let age = getAgeInYears(individual);
    let gender = getGenderName(individual);
    let relationship = individual['person']!['relationshipType']!;
    return [age, gender, relationship];
  });

  const bedroom_results = calculateBedrooms(bedroomArray);
  const waitingTime = getWaitingTime(bedroom_results);

  return (
    <Layout pageName="What to expect">
      <HeadingOne content="What to expect" />
      <Announcement variant="success">
        <Paragraph>
          If you qualify for the housing register, you may be able to apply for
          a <strong>{bedroom_results} bedroom</strong> property.
        </Paragraph>
        <Paragraph>
          The average waiting time for a two bedroom property is{' '}
          <strong>{waitingTime} years.</strong>
        </Paragraph>
        <Paragraph>
          Next, you will need to complete more information to determine if you
          qualify for the housing register.
        </Paragraph>
      </Announcement>

      <ButtonLink href="/apply/overview">Save and continue</ButtonLink>
      <DeleteLink content="Cancel this application" onDelete={onCancel} />
    </Layout>
  );
};

export default WhatToExpect;
