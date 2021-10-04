import { Application } from '../../domain/HousingApi';
import AdminForm from './admin-form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import { FormikValues } from 'formik';
import { useAppDispatch } from '../../lib/store/hooks';
import { applicantHasId } from '../../lib/store/applicant';
import { updateApplication } from '../../lib/store/application';
import { useRouter } from 'next/router';

export interface MedicalDetailPageProps {
  data: Application;
  initialValues: FormikValues;
}

export default function MedicalDetail({
  data,
  initialValues,
}: MedicalDetailPageProps): JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const formData = getFormData(FormID.ADMIN_HEALTH_ACTIONS);

  const returnUrl = `/applications/view/${data.id}`;

  const nextStep = (values: FormikValues) => {
    if (applicantHasId(data.mainApplicant)) {
      const request: Application = {
        ...data,
        mainApplicant: {
          ...data.mainApplicant,
          medicalNeed: {
            formRecieved: values.dateFormRecieved,
            formLink: values.linkToMedicalForm,
          },
          medicalOutcome: {
            accessibileHousingRegister: values.accessibleHousingRegister,
            additionalInformaton: values.additionalInformation,
            assessmentDate: values.assessmentDate,
            disability: values.disability,
            outcome: values.outcome,
          },
        },
      };

      dispatch(updateApplication(request));
      router.push(returnUrl);
    }
  };

  return (
    <AdminForm
      initialValues={initialValues}
      buttonText="Update Application"
      formData={formData}
      onSubmit={nextStep}
    />
  );
}
