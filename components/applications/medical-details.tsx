import { Application } from '../../domain/HousingApi';
import AdminForm from './admin-form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import { FormikValues } from 'formik';
import { useAppDispatch } from '../../lib/store/hooks';
import { updateApplicant, applicantHasId } from '../../lib/store/applicant';

export interface MedicalDetailPageProps {
  data: Application;
}

export default function MedicalDetail({
  data,
}: MedicalDetailPageProps): JSX.Element {
  const dispatch = useAppDispatch();

  const formData = getFormData(FormID.ADMIN_HEALTH_ACTIONS);

  const nextStep = (values: FormikValues) => {
    if (applicantHasId(data.mainApplicant)) {
      dispatch(
        updateApplicant({
          person: { id: data.mainApplicant.person.id },
          medicalNeed: {
            formRecieved: '',
            formLink: 'This is the form link',
          },
          medicalOutcome: {
            accessibileHousingRegister: '',
            additionalInformaton: '',
            assessmentDate: '',
            disability: '',
            outcome: '',
          },
        })
      );
    }
  };

  const onSave = (values: FormikValues) => {
    alert('on save');
    if (applicantHasId(data.mainApplicant)) {
      dispatch(
        updateApplicant({
          person: { id: data.mainApplicant.person.id },
          medicalNeed: {
            formRecieved: '',
            formLink: 'This is the form link',
          },
          medicalOutcome: {
            accessibileHousingRegister: '',
            additionalInformaton: '',
            assessmentDate: '',
            disability: '',
            outcome: '',
          },
        })
      );
    }
    alert('saved');
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
