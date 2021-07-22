import { FormField } from '../../lib/types/form';
import assertNever from '../../lib/utils/assertNever';
import Paragraph from '../content/paragraph';
import Checkboxes, { CheckboxesProps } from './checkboxes';
import DateInput from './dateinput';
import Input from './input';
import Radios, { RadiosProps } from './radios';
import Select from './select';
import Textarea from './textarea';

interface DynamicFieldProps {
  field: FormField;
  onAddressLookup?: any;
  timeAtAddress?: any;
  handleChange?: any;
}

export default function DynamicField({
  field,
  onAddressLookup,
  timeAtAddress,
  handleChange,
}: DynamicFieldProps): JSX.Element {
  switch (field.as) {
    case 'checkbox':
    case 'checkboxes':
      return <Checkboxes {...(field as CheckboxesProps)} />;

    case 'radios':
      return <Radios {...(field as RadiosProps)} />;

    case 'select':
      return <Select {...field} />;

    case 'textarea':
      return <Textarea {...field} />;

    case 'dateinput':
      return (
        <DateInput
          {...field}
          timeAtAddress={timeAtAddress}
          handleChange={handleChange}
        />
      );

    case 'paragraph':
      return <Paragraph>{field.label}</Paragraph>;

    case undefined:
      return <Input {...field} onAddressLookup={onAddressLookup} />;

    default:
      return assertNever(field, 'unknown field dynamic type');
  }
}
