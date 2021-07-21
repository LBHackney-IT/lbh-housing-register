import { FormField } from '../../lib/types/form';
import Paragraph from '../content/paragraph';
import BirthdayInput from './birthdayinput';
import Checkboxes, { CheckboxesProps } from './checkboxes';
import DateInput from './dateinput';
import Dropdown from './dropdown';
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

    case 'dateinput':
      return (
        <DateInput
          {...field}
          timeAtAddress={timeAtAddress}
          handleChange={handleChange}
        />
      );

    case 'birthdayinput':
      return <BirthdayInput {...field} />;

    case 'dropdown':
      return <Dropdown {...field} />;

    case 'paragraph':
      return <Paragraph>{field.label}</Paragraph>;

    default:
      return <Input {...field} onAddressLookup={onAddressLookup} />;
  }
}
