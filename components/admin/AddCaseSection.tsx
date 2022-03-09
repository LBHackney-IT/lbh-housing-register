import Input from '../form/input';
import Textarea from '../form/textarea';
import DateInput, { INVALID_DATE } from '../form/dateinput';
import Select from '../form/select';
import {
  SummaryListNoBorder,
  SummaryListActions,
  SummaryListRow,
  SummaryListKey,
  SummaryListValue,
} from '../summary-list';
import { Checkbox } from '../form/checkboxes';
import { FormField, FormFieldOption } from '../../lib/types/form';
import { generateUniqueFieldName } from '../../lib/utils/adminHelpers';

interface PageProps {
  section: any;
}

export default function AddCaseSection({ section }: PageProps): JSX.Element {
  // Currently using "any" as multiple form types are used.
  const markup = section.fields.map((field: any, index: number) => {
    // Do not show student accomodation fields
    if (
      (section.sectionId === 'employment' && field.name === 'address-finder') ||
      field.name === 'course-completion-date'
    ) {
      return false;
    }

    const inputType = field.as ? field.as : 'text';

    // This ensures all inputs have unique names
    const generatedInputName = generateUniqueFieldName(
      section.sectionId,
      field.name
    );

    let inputField: JSX.Element = <></>;

    if (inputType === 'text') {
      inputField = <Input name={generatedInputName} />;
    }

    if (inputType === 'textarea') {
      inputField = (
        <Textarea name={generatedInputName} label="" as="textarea" />
      );
    }

    if (inputType === 'dateinput') {
      inputField = (
        <DateInput
          name={generatedInputName}
          label={field.label}
          showDay={true}
        />
      );
    }

    if (inputType === 'checkbox') {
      inputField = <Checkbox name={generatedInputName} label="" value="" />;
    }

    if (
      inputType === 'select' ||
      inputType === 'radios' ||
      inputType === 'checkboxes'
    ) {
      if (field.options[0].value !== '') {
        field.options.unshift({ label: 'Select an option', value: '' });
      }

      inputField = (
        <>
          <Select
            modifierClasses="lbh-select--full-width"
            label=""
            name={generatedInputName}
            options={field.options.map((option: FormFieldOption) => ({
              label: option.label,
              value: option.value,
            }))}
          />
        </>
      );
    }

    if (
      inputType === 'radioconditional' ||
      inputType === 'checkboxesconditional'
    ) {
      if (field.options[0].value !== '') {
        field.options.unshift({ label: 'Select an option', value: '' });
      }

      const withConditional = field.options.filter((option: any) =>
        option.hasOwnProperty('conditionalFieldInput')
      );
      const {
        as: conditionalInputType,
        fieldName: conditionalFieldName,
        label: conditionalLabel,
      } = withConditional[0].conditionalFieldInput;

      const uniqueConditionalFieldName = generateUniqueFieldName(
        section.sectionId,
        conditionalFieldName
      );

      inputField = (
        <>
          <Select
            modifierClasses="lbh-select--full-width"
            label=""
            name={generatedInputName}
            options={field.options.map((option: FormFieldOption) => ({
              label: option.label,
              value: option.value,
            }))}
          />
          {conditionalInputType === 'textarea' && (
            <Textarea
              name={uniqueConditionalFieldName}
              label={conditionalLabel}
              as="textarea"
            />
          )}
          {conditionalInputType === 'input' && (
            <Input name={uniqueConditionalFieldName} label={conditionalLabel} />
          )}
        </>
      );
    }

    let title = '';
    if (section.sectionId === 'situation-armed-forces') {
      title = 'Your situation';
    } else if (
      index === 0 &&
      section.sectionId !== 'current-accommodation-host-details' &&
      section.sectionId !== 'current-accommodation-landlord-details'
    ) {
      title = section.sectionHeading;
    } else {
      title = '';
    }

    return (
      <SummaryListRow key={index}>
        <SummaryListKey>{title}</SummaryListKey>
        <SummaryListValue>
          <label htmlFor={generatedInputName}>{field.label}</label>
        </SummaryListValue>
        <SummaryListActions wideActions={true}>{inputField}</SummaryListActions>
      </SummaryListRow>
    );
  });

  return <SummaryListNoBorder>{markup}</SummaryListNoBorder>;
}
