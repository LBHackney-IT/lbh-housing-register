import { useRouter } from 'next/router'
import Layout from '../../../components/layout/staff-layout';
import { HeadingOne } from "../../../components/headings"
import Paragraph from "../../../components/paragraph"

export default function Application(): JSX.Element {
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };

  return (
    <Layout>
      <HeadingOne content={`Application Details - #${id}`} />
      <Paragraph content="<strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Pellentesque mi ex, maximus tempus condimentum eget, volutpat eu nunc. Mauris tincidunt, neque quis viverra ultricies, tellus lacus fringilla tortor, at blandit purus diam et augue." />
    </Layout>
  )
}
