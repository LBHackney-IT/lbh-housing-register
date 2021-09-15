import { HeadingOne } from '../components/content/headings';
import Paragraph from '../components/content/paragraph';
import Layout from '../components/layout/staff-layout';

export default function AccessDeniedPage(): JSX.Element {
  return (
    <Layout pageName="Access denied">
      <HeadingOne content="Access denied ⛔" />
      <Paragraph>
        Make sure you have been assigned the relevant permissions within
        Hackney.
      </Paragraph>
    </Layout>
  );
}
