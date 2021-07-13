import { agree } from '../../lib/store/applicant';
import { useAppDispatch } from '../../lib/store/hooks';
import { AGREEMENT, getFormData } from '../../lib/utils/form-data';
import { HeadingOne } from '../content/headings';
import Paragraph from '../content/paragraph';
import Form from '../form/form';

export default function ApplicationAgreement() {
  const dispatch = useAppDispatch();

  const onSave = () => {
    dispatch(agree(true));
  };

  return (
    <>
      <HeadingOne content="Before you continue" />

      <Paragraph>
        I understand that the information I provide will be verified by Hackney
        Council to assess my level of housing need.
      </Paragraph>

      <Paragraph>
        The answers and evidence I provide may be referred to credit agencies,
        other local authorities, medical professionals and HMRC.
      </Paragraph>

      <Paragraph>
        I agree to allow a Housing Officer to conduct a home visit to assess my
        current living situation without advance notice. If I do not allow
        entry, my application may be declined.
      </Paragraph>

      <Form
        buttonText="Save and continue"
        formData={getFormData(AGREEMENT)}
        onSave={onSave}
      />
    </>
  );
}
