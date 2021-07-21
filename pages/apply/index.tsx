import Link from 'next/link';
import Announcement from '../../components/announcement';
import { ButtonLink } from '../../components/button';
import { HeadingOne, HeadingTwo } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Table, {
    TableCell,
    TableHeading,
    TableRow
} from '../../components/content/table';
import Layout from '../../components/layout/resident-layout';

export default function ApplicationHomePage(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content={`Apply to the ${process.env.NEXT_PUBLIC_NAME!}`} />

      <HeadingTwo content="What to expect" />
      <Paragraph>
        It may take up to one hour to complete your application. You will need
        to supply personal details for each person in your application. You can
        save your progress and return to your application within 30 days before
        submitting.
      </Paragraph>

      <HeadingTwo content="What documents you'll need to provide" />
      <Paragraph>
        You will need to upload proof of identity, address, income, any savings,
        and benefits for each person in your application. You may need to supply
        additional documentation based on your circumstances.
      </Paragraph>

      <HeadingTwo content="What happens afterwards?" />
      <Paragraph>
        The information you provide will be verified with third parties. This
        will help us to assess you suitability for social housing in Hackney. If
        you application is successful, you may still wait many years until a
        housing offer is made.
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

      <HeadingTwo content="I still want to apply" />
      <ButtonLink href="/apply/start">Start now</ButtonLink>
    </Layout>
  );
}
