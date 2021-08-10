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
import { CALCULATE_BEDROOMS } from '../../lib/utils/bedroomCalculator';
import { useState, useEffect } from 'react';

const WhatToExpect = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [CalculatedBedrooms, setCalculatedBedrooms] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);

  const onCancel = () => {
    dispatch(signOut());
    router.push('/');
  };

  const getAge = (date: string) => {
    let today = new Date();
    let birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getGender = (gender: string) => {
    switch (gender) {
      case 'M':
        return 'male';
      case 'F':
        return 'female';
    }
  };

  const getWaitingTime = (bedroom: number) => {
    switch (bedroom) {
      case 1:
        return 4;
      case 2:
        return 11;
      case 3:
        return 12;
      case 4:
        return 17;
      default:
        return 17;
    }
  };

  const applicants = useAppSelector((store) =>
    [store.application.mainApplicant, store.application.otherMembers]
      .filter((v): v is Applicant | Applicant[] => v !== undefined)
      .flat()
  );

  const bedroomArray = applicants.map((individual) => {
    let age = getAge(individual['person']!['dateOfBirth']!);
    let gender = getGender(individual['person']!['gender']!);
    let relationship = individual['person']!['relationshipType']!;
    return [age, gender, relationship];
  });

  const bedroom_results = CALCULATE_BEDROOMS(bedroomArray);
  useEffect(() => {
    setCalculatedBedrooms(bedroom_results);
  }, [bedroom_results]);

  useEffect(() => {
    setWaitingTime(getWaitingTime(bedroom_results));
  }, [bedroom_results]);

  return (
    <Layout pageName="What to expect">
      <HeadingOne content="What to expect" />
      <Announcement variant="success">
        <Paragraph>
          If you qualify for the housing register, you may be able to apply for
          a <strong>{CalculatedBedrooms} bedroom</strong> property.
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
