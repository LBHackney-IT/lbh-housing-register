import { useState, useEffect } from 'react';
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
import WarningText from '../components/content/WarningText';
import Table, {
  TableCell,
  TableHeading,
  TableRow,
} from '../components/content/table';
import Layout from '../components/layout/resident-layout';
import { useAppSelector } from '../lib/store/hooks';
import ContactUsDialog from '../components/content/ContactUsDialog';
import List, { ListItem } from '../components/content/list';

export default function ApplicationHomePage(): JSX.Element {
  const router = useRouter();
  const [contactUsDialogOpen, setContactUsDialogOpen] = useState(false);
  const isLoggedIn = useAppSelector((store) => store.application.id);

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/apply/overview');
    }
  }, [isLoggedIn]);

  return (
    <>
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
          save your progress and come back to your application at any time
          within 30 days before you submit it.
        </Paragraph>

        {/* <WarningText>
          Do not use this form if you are at risk of domestic abuse, gang
          violence or threatened with homelessness. Instead,{' '}
          <a
            href="#"
            className="lbh-link lbh-link--no-visited-state"
            onClick={() => setContactUsDialogOpen(true)}
          >
            contact us
          </a>{' '}
          for immediate support
        </WarningText> */}
        <WarningText>
          Do not use this form if any of the following apply to you:
          <List>
            <ListItem bold={true}>You are currently homeless</ListItem>
            <ListItem bold={true}>
              You have been threatened with homelessness
            </ListItem>
            <ListItem bold={true}>You are a victim of domestic abuse</ListItem>
            <ListItem bold={true}>You are a victim of gang violence </ListItem>
          </List>
          <Paragraph bold={true}>
            In these circumstances you should contact us on 020 8356 2929 or{' '}
            <a className="lbh-link" href="https://forms.gle/riaWcWbAY1j6uszR7">
              complete this form
            </a>{' '}
            and we will contact you within 24 hours.
          </Paragraph>
        </WarningText>

        <ContactUsDialog
          contactUsDialogOpen={contactUsDialogOpen}
          setContactUsDialogOpen={setContactUsDialogOpen}
        />

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
            Due to the demand for council housing in Hackney, many people who
            join the register will never receive a council property.
          </Paragraph>

          <Paragraph>
            We strongly recommend that you consider all alternative housing
            options. For many people, the most realistic option is to rent in
            the private sector.
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
            If you choose to rent privately, we may be able to help in a number
            of ways, both financially and practically.
            <br />
            <Link href="https://hackney.gov.uk/housing-options">
              <a className="lbh-link lbh-link--no-visited-state">
                Find out more{' '}
                <span className="govuk-visually-hidden">
                  about housing options
                </span>{' '}
              </a>
            </Link>
          </Paragraph>
        </Announcement>

        <HeadingTwo content="I still want to apply" />
        <ButtonLink
          href="/apply/sign-in"
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
          Start or resume application
        </ButtonLink>
      </Layout>
    </>
  );
}
