import Link from 'next/link';
import { ButtonLink } from '../components/button';
import { HeadingOne, HeadingTwo } from '../components/content/headings';
import Paragraph from '../components/content/paragraph';
import Layout from '../components/layout/resident-layout';

export default function Home(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="Check to see if you are eligible" />
      <Paragraph>
        Use this checker to find out what type of settled accommodation is right
        for your household.
      </Paragraph>
      <Paragraph>This will take a few minutes.</Paragraph>
      <ButtonLink href="/eligibility">Start now</ButtonLink>

      <HeadingTwo content="Already started an application?" />
      <Link href="/apply/sign-in">
        <a className="govuk-link">Sign in</a>
      </Link>
    </Layout>
  );
}
