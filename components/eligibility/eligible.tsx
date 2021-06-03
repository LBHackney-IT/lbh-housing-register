import { ButtonLink } from '../button';
import { HeadingOne, HeadingTwo } from '../content/headings';
import Paragraph from '../content/paragraph';

export default function Eligible(): JSX.Element {
  return (
    <>
      <HeadingOne content="You can apply to join the housing register" />
      <HeadingTwo content="What next?" />
      <Paragraph>
        If you would like to apply to join the housing register, you need to
        provide more information so we can determine if you qualify.
      </Paragraph>
      <ButtonLink href="/apply">Continue</ButtonLink>
    </>
  );
}
