import { FormField } from '../../lib/types/form';
import assertNever from '../../lib/utils/assertNever';
import Paragraph from '../content/paragraph';
import AnnouncementText from './announcement-text';
import Checkboxes, { CheckboxesProps } from './checkboxes';
import CheckboxesConditional, {
  CheckboxesConditionalProps,
} from './CheckboxesConditional';
import DateInput from './dateinput';
import Input from './input';
import RadioConditional, { RadioConditionalProps } from './radioconditional';
import Radios, { RadiosProps } from './radios';
import Select from './select';
import Textarea from './textarea';

interface DynamicFieldProps {
  field: FormField;
}

export default function DynamicField({
  field,
}: DynamicFieldProps): JSX.Element {
  switch (field.as) {
    case 'checkbox':
    case 'checkboxes':
      // todo no as
      return <Checkboxes {...(field as CheckboxesProps)} />;

    case 'radios':
      // todo no as
      return <Radios {...(field as RadiosProps)} />;

    case 'select':
      return <Select {...field} />;

    case 'textarea':
      return <Textarea {...field} />;

    case 'dateinput':
      return <DateInput {...field} />;

    case 'paragraph':
      return <Paragraph>{field.label}</Paragraph>;

    case 'announcement':
      return <AnnouncementText {...field} />;

    case 'radioconditional':
      return <RadioConditional {...(field as RadioConditionalProps)} />;

    case 'checkboxesconditional':
      return (
        <CheckboxesConditional {...(field as CheckboxesConditionalProps)} />
      );

    case undefined:
      return <Input {...field} />;

    default:
      return assertNever(field, 'unknown field dynamic type');
  }
}
