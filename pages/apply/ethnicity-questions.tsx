import { FormikValues, getIn } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HeadingTwo } from '../../components/content/headings';
import Paragraph from '../../components/content/paragraph';
import Form from '../../components/form/form';
import Layout from '../../components/layout/resident-layout';
import { FormID, getFormData } from '../../lib/utils/form-data';
import Custom404 from '../404';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { updateWithFormValues } from '../../lib/store/applicant';

export default function EthnicityQuestions() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const applicant = useAppSelector((store) => store.application.mainApplicant);

  if (!applicant) {
    return <Custom404 />;
  }

  const returnHref = '/apply/confirmation';

  const [formId, setFormId] = useState('ethnicity-questions');

  console.log('FormID ', formId);

  const [activeStepID, setActiveStepId] = useState(() => {
    switch (formId) {
      case 'ethnicity-category-asian-asian-british':
        return FormID.ETHNICITY_CATAGORY_ASIAN_ASIAN_BRITISH;

      case 'ethnicity-category-black-black-british':
        return FormID.ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH;

      case 'ethnicity-category-mixed-multiple-background':
        return FormID.ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND;

      case 'ethnicity-catagory-white':
        return FormID.ETHNICITY_CATAGORY_WHITE;

      case 'ethnicity-category-other-ethnic-group':
        return FormID.ETHNICITY_CATEGORY_OTHER_ETHNIC_GROUP;

      default:
        return FormID.ETHNICITY_QUESTIONS;
    }
  });

  const formData = getFormData(activeStepID);

  const nextStep = (values: FormikValues) => {
    const { nextFormId } = formData.conditionals?.find(
      (element) => getIn(values, element.fieldId) === element.value
    ) ?? { nextFormId: 'exit' };
    console.log('nextFormId', nextFormId);

    if (nextFormId === 'exit') {
      dispatch(
        updateWithFormValues({
          formID: activeStepID,
          personID: applicant.person?.id || '',
          values,
          markAsComplete: true,
        })
      );
      router.push(returnHref);
      return;
    }

    setFormId(nextFormId);
    setActiveStepId(nextFormId);
  };

  const onSave = (values: FormikValues) => {
    dispatch(
      updateWithFormValues({
        formID: activeStepID,
        personID: applicant.person?.id || '',
        values,
        markAsComplete: true,
      })
    );
  };

  return (
    <Layout pageName="Ethnicity Questions">
      {formData.heading && <HeadingTwo content={formData.heading} />}
      {formData.copy && <Paragraph>{formData.copy}</Paragraph>}
      <Form
        key={activeStepID}
        buttonText="Save and continue"
        formData={formData}
        onSave={onSave}
        onSubmit={nextStep}
      />
    </Layout>
  );
}
