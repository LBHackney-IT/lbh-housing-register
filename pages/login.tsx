import Layout from '../components/layout/resident-layout';
import Button from "../components/button"
import { HeadingOne } from "../components/headings"
import Paragraph from "../components/paragraph"

export default function Login(): JSX.Element {
  return (
    <Layout>
      <HeadingOne content="Staff login" />
      <Paragraph content="<strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Pellentesque mi ex, maximus tempus condimentum eget, volutpat eu nunc. Mauris tincidunt, neque quis viverra ultricies, tellus lacus fringilla tortor, at blandit purus diam et augue." />
      <Button href="/applications">Login</Button>
    </Layout>
  )
}
