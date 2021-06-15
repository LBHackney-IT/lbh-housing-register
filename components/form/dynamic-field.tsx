import Checkboxes, { CheckboxesProps } from './checkboxes';
import Input from './input';
import Radios, { RadiosProps } from './radios';
import Select from './select';
import Textarea from './textarea';
import { FormField } from '../../lib/types/form';

interface DynamicFieldProps {
  field: FormField;
}

export default function DynamicField({
  field,
}: DynamicFieldProps): JSX.Element {
  // console.log('what is dynamic-field:field:', field)
  switch (field.as?.toLowerCase()) {
    case 'checkbox':
    case 'checkboxes':
      return <Checkboxes {...(field as CheckboxesProps)} />;

    case 'radios':
      return <Radios {...(field as RadiosProps)} />;

    case 'select':
      return <Select {...field} />;

    case 'textarea':
      return <Textarea {...field} />;

    default:
      return <Input {...field} />;
  }
}
