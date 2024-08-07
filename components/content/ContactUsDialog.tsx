import Dialog from '../dialog';
import { HeadingTwo } from './headings';

interface ContactUsDialogProps {
  contactUsDialogOpen: boolean;
  setContactUsDialogOpen: (contactUsDialogOpen: boolean) => void;
}

export default function ContactUsDialog({
  contactUsDialogOpen,
  setContactUsDialogOpen,
}: ContactUsDialogProps): JSX.Element {
  return (
    <Dialog
      isOpen={contactUsDialogOpen}
      title="Contact us"
      onCancel={() => setContactUsDialogOpen(false)}
      onCancelText="Close"
    >
      <HeadingTwo content="Call 020 8356 2929" />
      <p className="lbh-body-m">Open Monday to Friday, from 9am to 5pm.</p>
      <p className="lbh-body-m lbh-!-margin-top-0">
        An emergency line operates outside these hours.
      </p>
      <p className="lbh-body-m">
        If you are at risk of domestic abuse, gang violence or homelessness,
        please{' '}
        <a className="lbh-link" href="https://forms.gle/riaWcWbAY1j6uszR7">
          complete this form
        </a>{' '}
        and we will contact you within 24 hours.
      </p>
    </Dialog>
  );
}
