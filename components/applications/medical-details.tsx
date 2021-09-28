import { Application } from '../../domain/HousingApi';
import AdminForm from './admin-form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import { FormikValues } from 'formik';
import { useAppDispatch } from '../../lib/store/hooks';
import {
  updateWithFormValues,
  applicantHasId,
} from '../../lib/store/applicant';

export interface MedicalDetailPageProps {
  data: Application;
}

export default function MedicalDetail({
  data,
}: MedicalDetailPageProps): JSX.Element {
  const dispatch = useAppDispatch();
  const onSave = (values: FormikValues) => {};
  const formData = getFormData(FormID.ADMIN_HEALTH_ACTIONS);

  const nextStep = (values: FormikValues) => {
    if (applicantHasId(data.mainApplicant)) {
      dispatch(
        updateWithFormValues({
          formID: FormID.ADMIN_HEALTH_ACTIONS,
          personID: data.mainApplicant.person.id,
          values,
          markAsComplete: true,
        })
      );
    }
  };

  return (
    <AdminForm
      buttonText="Update Application"
      formData={formData}
      onSave={onSave}
      onSubmit={nextStep}
    />
  );
}
