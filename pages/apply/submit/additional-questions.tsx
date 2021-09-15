import { FormikValues } from 'formik';
import { useRouter } from 'next/router';
import { HeadingOne } from '../../../components/content/headings';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import { FormID, getFormData } from '../../../lib/utils/form-data';
import Custom404 from '../../404';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import {
  getQuestionsForFormAsValues,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import withApplication from '../../../lib/hoc/withApplication';

const AdditonalQuestions = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const applicant = useAppSelector((store) => store.application.mainApplicant);

  if (!applicant) {
    return <Custom404 />;
  }

  const initialValues = {
    ...getQuestionsForFormAsValues(FormID.ADDITIONAL_QUESTIONS, applicant),
  };

  const returnHref = '/apply/submit/ethnicity-questions';
  const onSubmit = (values: FormikValues) => {
    dispatch(
      updateWithFormValues({
        formID: FormID.ADDITIONAL_QUESTIONS,
        personID: applicant.person?.id || '',
        values,
        markAsComplete: true,
      })
    );
    router.push(returnHref);
  };

  return (
    <Layout pageName="Before you submit">
      <HeadingOne content="Before you submit" />
      <Form
        initialValues={initialValues}
        buttonText="Save and continue"
        formData={getFormData(FormID.ADDITIONAL_QUESTIONS)}
        onSubmit={onSubmit}
      />
    </Layout>
  );
};

export default withApplication(AdditonalQuestions);
