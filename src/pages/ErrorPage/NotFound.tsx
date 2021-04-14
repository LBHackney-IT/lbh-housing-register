import HeadingOne from "../../components/Typography/HeadingOne"
import Paragraph from "../../components/Typography/Paragraph"

const NotFound = (): JSX.Element => (
  <>
    <HeadingOne content="404 Page not found" />
    <Paragraph content="The page you are trying to access was not found." />
  </>
)

export default NotFound