import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import {
  sendConfirmation,
  completeApplication,
  sendDisqualifyEmail,
} from '../../../lib/store/application';
import withApplication from '../../../lib/hoc/withApplication';
import { checkEligible } from '../../../lib/utils/form';
import { getFormData, FormID } from '../../../lib/utils/form-data';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import { HeadingOne } from '../../../components/content/headings';
import Paragraph from '../../../components/content/paragraph';
import Custom404 from '../../404';

const Declaration = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const mainResident = useAppSelector((s) => s.application.mainApplicant);
  if (!mainResident) {
    return <Custom404 />;
  }

  const application = useAppSelector((store) => store.application);

  const submitApplication = async () => {
    const [isEligible] = checkEligible(application);
    if (!isEligible) {
      dispatch(sendDisqualifyEmail(application));
      router.push('/apply/not-eligible');
    } else {
      dispatch(sendConfirmation(application));
      dispatch(completeApplication(application));
      router.push('/apply/confirmation');
    }
  };

  return (
    <Layout pageName="Declaration">
      <HeadingOne content="Declaration" />

      <Paragraph>
        <strong>Please read and confirm the following statement</strong>
      </Paragraph>

      <Paragraph>
        I understand and agree that the information I have provided on this form
        may be shared with another local authority, another social landlord or a
        tenant management organisation, if they are considering my application.
      </Paragraph>

      <Paragraph>
        I declare that the information in this form is true and complete and I
        give consent to Hackney Council making such enquiries as may be
        necessary to confirm the information I have given.
      </Paragraph>

      <Paragraph>
        I understand that it is a criminal offence to provide false or
        misleading information, or to withhold relevant information which
        Hackney Council have reasonably required me to give. I understand that
        if information is found to be false, I may be prosecuted and you may
        repossess my home if a tenancy arises from it; or cancel my housing
        application or an offer of a property and I will not be able to re-apply
        to go on the Council’s housing register for at least 5 years. If I am
        prosecuted by you and found guilty, I understand that I could be ordered
        to pay a fine of up to £5,000.
      </Paragraph>

      <Form
        buttonText="Submit application"
        formData={getFormData(FormID.DECLARATION)}
        onSave={submitApplication}
      />
    </Layout>
  );
};

export default withApplication(Declaration);
