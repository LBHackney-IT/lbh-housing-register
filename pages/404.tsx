import { HeadingOne } from '../components/content/headings';
import Layout from '../components/layout/resident-layout';
import Paragraph from '../components/content/paragraph';

export default function Custom404(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="404 Page not found" />
      <Paragraph>The page you are trying to access was not found.</Paragraph>
    </Layout>
  );
}
