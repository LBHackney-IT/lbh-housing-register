import { useMemo } from 'react';
import { useAppSelector } from '../../lib/store/hooks';
import { checkEligible } from '../../lib/utils/form';
import { ButtonLink } from '../../components/button';
import { HeadingTwo } from '../../components/content/headings';
import InsetText from '../../components/content/inset-text';
import List, { ListItem } from '../../components/content/list';
import Paragraph from '../../components/content/paragraph';
import Layout from '../../components/layout/resident-layout';
import Panel from '../../components/panel';
import withApplication from '../../lib/hoc/withApplication';
import { useRouter } from 'next/router';

const NotEligible = (): JSX.Element => {
  const router = useRouter();

  const application = useAppSelector((store) => store.application);
  const mainApplicant = useAppSelector(
    (store) => store.application.mainApplicant
  );

  const [isEligible, reasons] = useMemo(
    () => (mainApplicant && checkEligible(mainApplicant)) ?? [],
    [mainApplicant]
  );

  if (isEligible) {
    router.push('/apply/overview');
  }

  return (
    <Layout>
      <Panel
        heading="You don't qualify to join the housing register"
        message={`Your reference number: ${application.reference?.toUpperCase()}`}
      />

      {reasons && reasons.length > 0 && (
        <>
          <HeadingTwo content="Why is this?" />
          {reasons?.map((reason, index) => (
            <InsetText key={index}>
              <Paragraph>{reason}</Paragraph>
            </InsetText>
          ))}
        </>
      )}

      <HeadingTwo content="What next?" />
      <Paragraph>
        <strong>
          We can provide support to help you move into a privately rented home
        </strong>
      </Paragraph>
      <Paragraph>
        If you choose to rent privately, the Council may be able to help provide
        the following assistance:
      </Paragraph>
      <List>
        <ListItem>One months rent in advance</ListItem>
        <ListItem>Security deposit paid</ListItem>
        <ListItem>Landlord compliance check</ListItem>
        <ListItem>Longest possible tenancy terms</ListItem>
        <ListItem>Pre-inspection of the property</ListItem>
        <ListItem>Practical and financial help with removals</ListItem>
        <ListItem>
          Transport costs for viewing and moving if outside of London
        </ListItem>
        <ListItem>
          Financial assistance to provide white goods if they aren't provided by
          the landlord
        </ListItem>
      </List>
      <ButtonLink href="https://hackney.gov.uk/housing-application">
        Contact us for advice
      </ButtonLink>
    </Layout>
  );
};

export default withApplication(NotEligible);
