import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { updateUserAttribute } from '../../lib/store/cognitoUser';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { agree } from '../../lib/store/mainApplicant';
import { FormID, getFormData } from '../../lib/utils/form-data';
import { HeadingOne } from '../content/headings';
import Paragraph from '../content/paragraph';
import Form from '../form/form';

export default function ApplicationAgreement() {
  // TODO: might not be right place for this,
  // but we need to ensure new user is linked to application
  const dispatch = useAppDispatch();
  const applicationId = useAppSelector((store) => store.application.id);
  const router = useRouter();
  useEffect(() => {
    if (!applicationId) {
      router.replace('/');
    }
  }, [applicationId]);

  const onSave = () => {
    if (!applicationId) {
      throw new Error('No application.');
    }
    dispatch(agree());
    dispatch(updateUserAttribute({ applicationId: applicationId }));
  };

  return (
    <>
      <HeadingOne content="Before you continue" />

      <Paragraph>
        Hackney Council will verify the information you provide, so we can
        assess your housing needs, and eligibility for social housing.
      </Paragraph>

      <Paragraph>
        To do this, we may share your information with credit agencies, local
        authorities, medical professionals and HMRC.
      </Paragraph>

      <Paragraph>
        A Housing Needs and Benefits Officer may need to visit your home without
        advance notice to assess your living situation.
      </Paragraph>

      <Paragraph>
        By selecting I understand and accept below, you're agreeing to let them
        into your home, and understand that Hackney may reject your application
        if you don't.
      </Paragraph>

      <Form
        buttonText="Save and continue"
        formData={getFormData(FormID.AGREEMENT)}
        onSave={onSave}
      />
    </>
  );
}
