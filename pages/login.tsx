import Layout from '../components/layout/resident-layout';
import { ButtonLink } from "../components/button"
import { HeadingOne } from "../components/content/headings"
import Paragraph from "../components/content/paragraph"

export default function Login(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="Staff login" />
      <Paragraph>
        <strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Pellentesque mi ex, maximus tempus condimentum eget, volutpat eu nunc. Mauris tincidunt, neque quis viverra ultricies, tellus lacus fringilla tortor, at blandit purus diam et augue.
      </Paragraph>
      <ButtonLink href="/applications">Login</ButtonLink>
    </Layout>
  )
}
