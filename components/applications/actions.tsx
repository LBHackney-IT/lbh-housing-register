import { Application } from '../../domain/HousingApi';
import Form from '../../components/form/form';
import { FormID, getFormData } from '../../lib/utils/form-data';
import { FormikValues } from 'formik';

interface PageProps {
  data: Application;
}
const formData = getFormData(FormID.ADMIN_ACTIONS);
const nextStep = (values: FormikValues) => {};
const onSave = (values: FormikValues) => {};

export default function Actions({ data }: PageProps): JSX.Element {
  return (
    <Form
      buttonText="Save action"
      formData={formData}
      onSave={onSave}
      onSubmit={nextStep}
    />
  );
}
