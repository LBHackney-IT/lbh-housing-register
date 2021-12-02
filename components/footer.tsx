import React, { useState } from 'react';
import Paragraph from '../components/content/paragraph';
import { HeadingThree } from './content/headings';
import ContactUsDialog from '../components/content/ContactUsDialog';

interface FooterProps {
  referenceNumber: string;
}

const Footer = ({ referenceNumber }: FooterProps) => {
  const [contactUsDialogOpen, setContactUsDialogOpen] = useState(false);
  return (
    <>
      <footer className="lbh-footer">
        <div className="lbh-container">
          <HeadingThree content="Help" />
          <Paragraph>
            If you need help completing this form, please contact us quoting
            your
            <strong>
              {' '}
              application reference {referenceNumber.toUpperCase()}
            </strong>{' '}
            and we will assist you.
            <br />
            <button
              className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
              onClick={() => setContactUsDialogOpen(true)}
            >
              Contact us
            </button>
          </Paragraph>

          <ContactUsDialog
            contactUsDialogOpen={contactUsDialogOpen}
            setContactUsDialogOpen={setContactUsDialogOpen}
          />

          <hr />

          <HeadingThree content="Lettings policy" />
          <Paragraph>
            All applications are assessed according to our{' '}
            <a
              className="lbh-link lbh-link--no-visited-state"
              href="https://hackney.gov.uk/lettings-policy"
            >
              lettings policy
            </a>
            .
          </Paragraph>

          <HeadingThree content="Confidentiality and data protection" />

          <Paragraph>
            We can only use the information given on the form to help us decide
            about your application for housing. This information will be place
            on our systems so we can assess your priority and housing needs. We
            will ensure confidentiality is maintained throughout and your data
            protected.
          </Paragraph>

          <Paragraph>
            We have a duty to protect public funds. In order to detect and
            prevent fraud we may disclose your data to any person or
            organisation adminestering public funds such as central government
            departments or other council teams such as housing benifits.
          </Paragraph>

          <Paragraph>
            It is a criminal offence to give false or misleading information or
            to hold back relevant information concerning your application
          </Paragraph>

          <Paragraph>
            You have the right to ask the council for a copy of your data and
            for a description of how it is being used and to whom it is being
            disclosed.
          </Paragraph>
        </div>
      </footer>
    </>
  );
};

export default Footer;
