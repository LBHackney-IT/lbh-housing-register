import Button from "../components/button"
import InsetText from "../components/inset-text"
import { HeadingOne } from "../components/headings"
import Paragraph from "../components/paragraph"

const Home = (): JSX.Element => (
  <>
    <HeadingOne content={process.env.NEXT_PUBLIC_NAME!} />
    <Paragraph content="<strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Pellentesque mi ex, maximus tempus condimentum eget, volutpat eu nunc. Mauris tincidunt, neque quis viverra ultricies, tellus lacus fringilla tortor, at blandit purus diam et augue." />
    <Paragraph content="Phasellus tempor in orci dapibus rhoncus. Cras sit amet venenatis velit. Donec iaculis lorem eu convallis venenatis. Ut scelerisque ac lacus non sodales." />
    <InsetText content="Nulla facilisi. In at nulla congue tellus ultrices porttitor. Sed eget nibh consectetur, gravida neque non, placerat nulla. Donec eros sapien, elementum ac dolor non, sodales tempor risus. Pellentesque vitae neque fermentum, iaculis nibh sit amet, fermentum metus." />
    <Button to="/apply">Get Started</Button>
  </>
)

export default Home