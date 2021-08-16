import Link from 'next/link';
import Announcement from '../components/announcement';
import { ButtonLink } from '../components/button';
import { HeadingOne, HeadingTwo } from '../components/content/headings';
import List, { ListItem } from '../components/content/list';
import Paragraph from '../components/content/paragraph';
import Table, {
  TableCell,
  TableHeading,
  TableRow,
} from '../components/content/table';
import Layout from '../components/layout/resident-layout';

export default function ApplicationHomePage(): JSX.Element {
  return (
    <Layout pageName="Home">
      <HeadingOne content="Apply to the Housing Register" />

      <HeadingTwo content="About this form" />
      <Paragraph>
        This form is to apply to join the Hackney housing register. If you successfully
        join the register, you will be on our waiting list for social housing.
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

      <HeadingTwo content="Documents you’ll need to provide" />
      <Paragraph>
        We'll ask you to upload proof of:
      </Paragraph>
      <List>
        <ListItem>identity</ListItem>
        <ListItem>address</ListItem>
        <ListItem>all income and savings</ListItem>
      </List>
      <Paragraph>
        Depending on your household's circumstances, you might need to provide
        additional documentation.
      </Paragraph>

      <HeadingTwo content="What happens next" />
      <Paragraph>
        Once you've submitted your information, we'll verify it, and assess if
        you’re eligible for social housing in Hackney. You will receive a decision
        by email within 20 working days.
      </Paragraph>
      <Paragraph>
        If your application is successful, you might still have to wait many years
        until you’re offered a home.
      </Paragraph>

      <Announcement variant="info">
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
            <TableCell>17 years</TableCell>
            <TableCell>2 months</TableCell>
          </TableRow>
        </Table>

        <Paragraph>
          <Link href="#">Why we recommend renting privately</Link>
        </Paragraph>
      </Announcement>

      <HeadingTwo content="Other options" />
      <Paragraph>
        <Link href="https://hackney.gov.uk/housing-options">
          View other housing options
        </Link>
      </Paragraph>

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

      <HeadingTwo content="Already started an application?" />
      <ButtonLink href="/apply/sign-in" secondary={true}>Sign in</ButtonLink>
    </Layout>
  );
}
