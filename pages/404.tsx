import { HeadingOne } from "../components/headings"
import Paragraph from "../components/paragraph"

export default function Custom404(): JSX.Element {
  return (
    <>
      <HeadingOne content="404 Page not found" />
      <Paragraph content="The page you are trying to access was not found." />
    </>
  )
}