import { useState } from 'react';

import { FormikValues, getIn } from 'formik';
import { useRouter } from 'next/router';

import { HeadingOne } from '../../../components/content/headings';
import Form from '../../../components/form/form';
import Layout from '../../../components/layout/resident-layout';
import { Applicant } from '../../../domain/HousingApi';
import withApplication from '../../../lib/hoc/withApplication';
import {
  getQuestionValue,
  selectApplicant,
  updateWithFormValues,
} from '../../../lib/store/applicant';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { FormID, getFormData } from '../../../lib/utils/form-data';
import Custom404 from '../../404';

const YourSituation = (): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeStepID, setActiveStepId] = useState(
    FormID.SITUATION_ARMED_FORCES
  );

  const { resident } = router.query as { resident: string };

  const applicant = useAppSelector(selectApplicant(resident)) as Applicant;

  if (!applicant) {
    return <Custom404 />;
  }

  // If JSON has routeSelect set to true we can pass multiple possible values to activeStepID.
  // See if statement at end of nextStep() below
  const routeSelectFunction = () => {
    const livingSituation: string = getQuestionValue(
      applicant.questions,
      FormID.CURRENT_ACCOMMODATION,
      'living-situation'
    );

    switch (livingSituation) {
      case 'squatter':
        return FormID.COURT_ORDER;

      case 'unauthorised-occupant':
        return FormID.ACCOMODATION_TYPE;

      case 'owner-occupier':
        return FormID.DOMESTIC_VIOLENCE;

      default:
        return FormID.HOMELESSNESS;
    }
  };

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
      name: `Your situation`,
    },
  ];

  const nextStep = (values: FormikValues) => {
    const { nextFormId, routeSelect } = formData.conditionals?.find(
      (element) => getIn(values, element.fieldId) === element.value
    ) ?? { nextFormId: 'exit', routeSelect: false };

    if (nextFormId === 'exit') {
      dispatch(
        updateWithFormValues({
          formID: FormID.YOUR_SITUATION,
          personID: applicant.person!.id!,
          values,
          markAsComplete: true,
        })
      );
      router.push(baseHref);
      return;
    }

    // If JSON has routeSelect set to true determine
    // route based on switch statement above, or continue as normal.
    if (routeSelect) {
      setActiveStepId(routeSelectFunction);
    } else {
      setActiveStepId(nextFormId);
    }
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
    <Layout pageName="Your situation" breadcrumbs={breadcrumbs}>
      <HeadingOne content="Your situation" />
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
};

export default withApplication(YourSituation);
