import { useMemo } from 'react';
import { useAppSelector } from '../../lib/store/hooks';
import { checkEligible } from '../../lib/utils/form';
import { ButtonLink } from '../../components/button';
import { HeadingTwo, HeadingThree } from '../../components/content/headings';
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
    () => (mainApplicant && checkEligible(application)) ?? [],
    [mainApplicant]
  );

  if (isEligible) {
    router.push('/apply/overview');
  }

  return (
    <Layout>
      <Panel heading="You don't qualify to join the housing register">
        Your reference number: {application.reference?.toUpperCase()}
      </Panel>

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
        We appreciate this may be difficult to hear. However we may be able to
        support you to find somewhere to live. Please contact the relevant
        support services team for advice on next steps.
      </Paragraph>
      <Paragraph>
        <strong>If you are a Council tenant</strong>{' '}
        <a className="lbh-link" href="https://hackney.gov.uk/housing-options">
          explore your housing options
        </a>{' '}
        or{' '}
        <a className="lbh-link" href="https://hackney.gov.uk/housing-offices/">
          contact your Neighbourhood service team
        </a>
        .
      </Paragraph>
      <Paragraph>
        <strong>If you are a Housing Association tenant</strong> please contact
        your Housing Association.
      </Paragraph>
      <Paragraph>
        <strong>If you are living in any other accommodation</strong> and you
        are concerned about your housing, please contact the Housing Options and
        Advice team on <a href="tel:02083562929">020 8356 2929</a>
      </Paragraph>
      <Paragraph>
        <strong>If you are interested in renting private accommodation</strong>{' '}
        please contact the Housing Supply team at{' '}
        <a className="lbh-link" href="mailto:housingsupply@hackney.gov.uk">
          housingsupply@hackney.gov.uk
        </a>
        . If you choose to rent privately, the Council may be able to help
        provide the following assistance:
      </Paragraph>

      <List>
        <ListItem>One month rent in advance</ListItem>
        <ListItem>Security deposit paid</ListItem>
        <ListItem>Landlord compliance check</ListItem>
        <ListItem>Longest possible tenancy terms</ListItem>
        <ListItem>Pre-inspection of the property</ListItem>
        <ListItem>Practical and financial help with removals</ListItem>
        <ListItem>
          Transport costs for viewing and moving if outside of London
        </ListItem>
        <ListItem>
          Financial assistance to provide white goods if they aren’t provided by
          the landlord
        </ListItem>
      </List>
      <HeadingThree content="You can challenge this decision" />
      <Paragraph>
        If you disagree with the decision that has been made, you can request a
        review by the Council.{' '}
      </Paragraph>
      <Paragraph>
        The way the Council determines who qualifies for the Housing Register is
        detailed in our Lettings policy. Before contacting us, please{' '}
        <a className="lbh-link" href="https://hackney.gov.uk/lettings-policy">
          read our Lettings policy
        </a>
        .
      </Paragraph>
      <Paragraph>
        If you still think you meet the criteria in our Lettings policy, you can
        request a review in writing within 21 days of the decision, by emailing
        <a className="lbh-link" href="mailto:ReviewsandAppeals@hackney.gov.uk">
          ReviewsandAppeals@hackney.gov.uk
        </a>{' '}
        telling us why you think you qualify.{' '}
      </Paragraph>
      <Paragraph>
        Please note that on average, only 6% of cases are accepted after being
        re-assessed.
      </Paragraph>
    </Layout>
  );
};

export default withApplication(NotEligible);
