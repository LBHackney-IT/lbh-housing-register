import { ButtonLink } from "../button";
import { HeadingOne } from "../content/headings";

export default function Eligible(): JSX.Element {
  return (
    <>
      <HeadingOne content="You qualify for the housing register" />
      <ButtonLink href="/apply">
        Continue
      </ButtonLink>
    </>
  )
}