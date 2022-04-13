import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Layout from '../../components/layout/resident-layout';
import { HeadingTwo, HeadingThree } from '../../components/content/headings';
import Button from '../../components/button';
import InsetText from '../../components/content/inset-text';
import List, { ListItem } from '../../components/content/list';
import Paragraph from '../../components/content/paragraph';
import ContactUsDialog from '../../components/content/ContactUsDialog';
import Panel from '../../components/panel';
import { useAppSelector } from '../../lib/store/hooks';
import { checkEligible } from '../../lib/utils/form';
import { exit } from '../../lib/store/auth';
import withApplication from '../../lib/hoc/withApplication';
import { ApplicationStatus } from '../../lib/types/application-status';
import { getDisqualificationReasonOption } from '../../lib/utils/disqualificationReasonOptions';
import WarningText from '../../components/content/WarningText';

const NotEligible = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [contactUsDialogOpen, setContactUsDialogOpen] = useState(false);
  const application = useAppSelector((store) => store.application);
  const mainApplicant = useAppSelector(
    (store) => store.application.mainApplicant
  );

  const [isEligible, reasons] = useMemo(
    () => (mainApplicant && checkEligible(application)) ?? [],
    [mainApplicant]
  );

  if (isEligible && application.status !== ApplicationStatus.DISQUALIFIED) {
    router.push('/apply/overview');
  }

  const signOut = () => {
    dispatch(exit());
  };

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
              <Paragraph>{getDisqualificationReasonOption(reason)}</Paragraph>
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

      <WarningText>
        Please check if any of the following apply to you:
        <List>
          <ListItem bold={true}>You are currently homeless</ListItem>
          <ListItem bold={true}>
            You have been threatened with homelessness
          </ListItem>
          <ListItem bold={true}>You are a victim of domestic abuse</ListItem>
          <ListItem bold={true}>You are a victim of gang violence </ListItem>
        </List>
        <Paragraph bold={true}>
          In these circumstances you should contact us on 020 8356 2929 or{' '}
          <a className="lbh-link" href="https://forms.gle/riaWcWbAY1j6uszR7">
            complete this form
          </a>{' '}
          and we will contact you within 24 hours.
        </Paragraph>
      </WarningText>

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
        Advice team on{' '}
        <a className="lbh-link" href="tel:02083562929">
          020 8356 2929
        </a>
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

      <HeadingThree content="Other enquiries" />

      <Paragraph>
        Please{' '}
        <a className="lbh-link" href="https://hackney.gov.uk/lettings-policy">
          read our Lettings policy
        </a>{' '}
        to understand how the Council determines who qualifies to join the
        housing register. If you still think you meet the criteria in our
        Lettings policy, please{' '}
        <a
          href="#"
          className="lbh-link lbh-link--no-visited-state"
          onClick={() => setContactUsDialogOpen(true)}
        >
          contact the Housing Options and Advice team
        </a>
        .
      </Paragraph>

      <ContactUsDialog
        contactUsDialogOpen={contactUsDialogOpen}
        setContactUsDialogOpen={setContactUsDialogOpen}
      />

      <Button onClick={signOut}>Sign out</Button>
    </Layout>
  );
};

export default withApplication(NotEligible);
