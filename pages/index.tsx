import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Announcement from '../components/announcement';
import { ButtonLink } from '../components/button';
import {
  HeadingOne,
  HeadingThree,
  HeadingTwo,
} from '../components/content/headings';
import Paragraph from '../components/content/paragraph';
import Table, {
  TableCell,
  TableHeading,
  TableRow,
} from '../components/content/table';
import Layout from '../components/layout/resident-layout';
import { useAppSelector } from '../lib/store/hooks';

export default function ApplicationHomePage(): JSX.Element {
  const router = useRouter();
  const isLoggedIn = useAppSelector((store) => store.application.id);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/apply/overview');
    }
  }, [isLoggedIn]);

  return (
    <Layout pageName="Home">
      <HeadingOne content="Apply to the Housing Register" />

      <HeadingTwo content="About this form" />
      <Paragraph>
        This form is to apply to join the Hackney housing register. If you
        successfully join the register, you will be on our waiting list for
        social housing.
      </Paragraph>
      <Paragraph>
        The form could take up to an hour to complete, as we ask for personal
        information about yourself and any other people you want to move with.
      </Paragraph>
      <Paragraph>
        If you don't have any of the information we ask for to hand, you can
        save your progress and come back to your application at any time within
        30 days before you submit it.
      </Paragraph>

      <HeadingTwo content="What happens next" />
      <Paragraph>
        After completing this form, we may email you links to securely provide
        additional information or documents to support your application.
      </Paragraph>
      <Paragraph>
        We will then verify your information to assess your suitability for
        social housing in Hackney. You will receive a decision by email within
        20 working days.
      </Paragraph>

      <Announcement variant="info">
        <HeadingThree content="Average waiting times" />

        <Paragraph>
          Due to the demand for council housing in Hackney, many people who join
          the register will never receive a council property.
        </Paragraph>

        <Paragraph>
          We strongly recommend that you consider all alternative housing
          options. For many people, the most realistic option is to rent in the
          private sector.
        </Paragraph>

        <Table>
          <TableHeading>Bedrooms required</TableHeading>
          <TableHeading>Housing Register</TableHeading>
          <TableHeading>Private rental</TableHeading>

          <TableRow>
            <TableCell>1 bedroom</TableCell>
            <TableCell>4 years</TableCell>
            <TableCell>1 month</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2 bedrooms</TableCell>
            <TableCell>11 years</TableCell>
            <TableCell>1 month</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3 bedrooms</TableCell>
            <TableCell>12 years</TableCell>
            <TableCell>1 month</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>4 bedrooms</TableCell>
            <TableCell>17 years</TableCell>
            <TableCell>1 month</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>5 bedrooms</TableCell>
            <TableCell>32 years</TableCell>
            <TableCell>2 months</TableCell>
          </TableRow>
        </Table>

        <Paragraph>
          If you choose to rent privately, we may be able to help in a number of
          ways, both financially and practically.
          <br />
          <Link href="https://hackney.gov.uk/housing-options">
            Find out more
          </Link>
        </Paragraph>
      </Announcement>

      <HeadingTwo content="I still want to apply" />
      <ButtonLink
        href="/apply/start"
        svg={
          <svg
            className="govuk-button__start-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="17.5"
            height="19"
            viewBox="0 0 33 40"
            aria-hidden="true"
            focusable="false"
          >
            <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
          </svg>
        }
      >
        Start now
      </ButtonLink>

      {/* TODO: Disabled until we get this working!
      <HeadingTwo content="Already started an application?" />
      <ButtonLink href="/apply/sign-in" secondary={true}>
        Sign in
      </ButtonLink>
      */}
    </Layout>
  );
}
