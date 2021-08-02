import { HeadingOne } from '../components/content/headings';
import Paragraph from '../components/content/paragraph';
import Layout from '../components/layout/resident-layout';

export default function Custom404(): JSX.Element {
  return (
    <Layout pageName="Page not found">
      <HeadingOne content="404 Page not found" />
      <Paragraph>The page you are trying to access was not found.</Paragraph>
    </Layout>
  );
}
