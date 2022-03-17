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
        </div>
      </footer>
    </>
  );
};

export default Footer;
