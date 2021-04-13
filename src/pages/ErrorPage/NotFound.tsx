import React from "react"
import HeadingOne from "../../components/Typography/HeadingOne"
import Paragraph from "../../components/Typography/Paragraph"

const NotFound = (): JSX.Element => (
  <React.Fragment>
    <HeadingOne content="404 Page not found" />
    <Paragraph content="The page you are trying to access was not found." />
  </React.Fragment>
)

export default NotFound