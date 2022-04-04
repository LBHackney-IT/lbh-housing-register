import { FormikValues, getIn } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HeadingOne } from '../../../components/content/headings';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import { FormID, getFormData } from '../../../lib/utils/form-data';
import Custom404 from '../../404';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { updateWithFormValues } from '../../../lib/store/applicant';
import withApplication from '../../../lib/hoc/withApplication';
import { Applicant } from '../../../domain/HousingApi';

const EthnicityQuestions = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const applicant = useAppSelector(
    (store) => store.application.mainApplicant
  ) as Applicant;

  const [formId, setFormId] = useState('ethnicity-questions');

  const [activeStepID, setActiveStepId] = useState(() => {
    switch (formId) {
      case 'ethnicity-extended-category-asian-asian-british':
        return FormID.ETHNICITY_CATEGORY_ASIAN_ASIAN_BRITISH;

      case 'ethnicity-extended-category-black-black-british':
        return FormID.ETHNICITY_CATEGORY_BLACK_BLACK_BRITISH;

      case 'ethnicity-extended-category-mixed-multiple-background':
        return FormID.ETHNICITY_CATEGORY_MIXED_MULTIPLE_BACKGROUND;

      case 'ethnicity-extended-category-white':
        return FormID.ETHNICITY_CATEGORY_WHITE;

      case 'ethnicity-extended-category-other-ethnic-group':
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

    if (nextFormId === 'exit') {
      dispatch(
        updateWithFormValues({
          formID: activeStepID,
          personID: applicant.person!.id!,
          values,
          markAsComplete: true,
        })
      );
      router.push('/apply/submit/declaration');
      return;
    }

    setFormId(nextFormId);
    setActiveStepId(nextFormId);
  };

  const onSave = (values: FormikValues) => {
    dispatch(
      updateWithFormValues({
        formID: activeStepID,
        personID: applicant.person!.id!,
        values,
        markAsComplete: true,
      })
    );
  };

  return (
    <>
      {applicant ? (
        <Layout pageName="Before you submit">
          <HeadingOne content="Before you submit" />
          <Form
            key={activeStepID}
            buttonText="Save and continue"
            formData={formData}
            onSave={onSave}
            onSubmit={nextStep}
          />
        </Layout>
      ) : (
        <Custom404 />
      )}
    </>
  );
};

export default withApplication(EthnicityQuestions);
