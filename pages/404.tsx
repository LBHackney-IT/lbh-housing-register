import { HeadingOne } from "../components/headings"
import Paragraph from "../components/paragraph"

const Custom404 = (): JSX.Element => (
  <>
    <HeadingOne content="404 Page not found" />
    <Paragraph content="The page you are trying to access was not found." />
  </>
)

export default Custom404