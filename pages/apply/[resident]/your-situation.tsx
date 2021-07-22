import { FormikValues, getIn } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HeadingTwo } from '../../../components/content/headings';
import Paragraph from '../../../components/content/paragraph';
import Form from '../../../components/form/form';
import Hint from '../../../components/form/hint';
import Layout from '../../../components/layout/resident-layout';
import {
  getQuestionValue,
  selectApplicant,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { FormID, getFormData } from '../../../lib/utils/form-data';
import Custom404 from '../../404';

export default function YourSituation() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { resident } = router.query as { resident: string };

  const applicant = useAppSelector(selectApplicant(resident));

  if (!applicant) {
    return <Custom404 />;
  }

  // TODO work this out.
  const livingSituation: string = getQuestionValue(
    applicant.questions,
    FormID.CURRENT_ACCOMMODATION,
    'living-situation'
  );

  const [activeStepID, setActiveStepId] = useState(() => {
    switch (livingSituation) {
      case 'squatter':
        return FormID.COURT_ORDER;

      case 'unauthorised-occupant':
        return FormID.ACCOMODATION_TYPE;

      case 'owner-occupier':
        return FormID.DOMESTIC_VIOLENCE;

      default:
        return FormID.HOMELESSESS;
    }
  });
  const formData = getFormData(activeStepID);

  const baseHref = `/apply/${applicant.person?.id}`;
  const returnHref = '/apply/overview';

  const breadcrumbs = [
    {
      href: returnHref,
      name: 'Application',
    },
    {
      href: baseHref,
      name: applicant.person?.firstName || '',
    },
    {
      href: `${baseHref}/your-situation`,
      name: `Your Situation`,
    },
  ];

  const nextStep = (values: FormikValues) => {
    const { nextFormId } = formData.conditionals?.find(
      (element) => getIn(values, element.fieldId) === element.value
    ) ?? { nextFormId: 'exit' };

    if (nextFormId === 'exit') {
      router.push(baseHref);
      return;
    }

    setActiveStepId(nextFormId);
  };

  const onSave = (values: FormikValues) => {
    dispatch(
      updateWithFormValues({
        formID: activeStepID,
        personID: applicant.person.id,
        values,
      })
    );
  };

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Hint content={applicant.person?.firstName ?? ''} />
      {formData.heading && <HeadingTwo content={formData.heading} />}
      {formData.copy && <Paragraph>{formData.copy}</Paragraph>}
      <Form
        // Intentional key outside of an array. Force a fresh form component when we change steps to avoid values persisting between forms.
        key={activeStepID}
        buttonText="Save and continue"
        formData={formData}
        onSave={onSave}
        onSubmit={nextStep}
      />
    </Layout>
  );
}
