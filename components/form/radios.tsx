import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import { FormField } from '../../lib/types/form';
import Paragraph from '../content/paragraph';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';

interface RadioProps extends FormField {
  index?: number;
  value: string;
}

export function Radio({
  index,
  hint,
  label,
  name,
  value,
}: RadioProps): JSX.Element {
  let id = name;

  if (index !== undefined) {
    id += `.${index}`;
  }

  return (
    <div className="govuk-radios__item">
      <Field
        className="govuk-radios__input"
        type="radio"
        id={id}
        name={name}
        value={value}
      />
      <Label
        className="govuk-radios__label"
        content={label || value}
        htmlFor={id}
      />

      {hint && <Hint className="govuk-radios__hint" content={hint} />}
    </div>
  );
}

export interface RadiosProps extends FormField {
  value: string;
  subheading?: string;
}

export default function Radios({
  hint,
  label,
  name,
  options,
  subheading,
}: RadiosProps): JSX.Element {
  return (
    <Field name={name}>
      {({
        field,
        meta,
      }: {
        field: FieldInputProps<string>;
        meta: FieldMetaProps<string>;
      }) => (
        <FormGroup error={!!meta.touched && !!meta.error}>
          {label && name !== 'medical-needs' && (
            <Label content={label} strong={true} />
          )}
          {hint && <Hint content={hint} />}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}
          {subheading && <Paragraph>{subheading}</Paragraph>}

          <div className="govuk-radios lbh-radios">
            {options?.map((radio, index) => (
              <Radio
                key={index}
                index={index}
                hint={radio.hint}
                label={radio.label!}
                name={field.name}
                value={radio.value}
              />
            ))}
          </div>
        </FormGroup>
      )}
    </Field>
  );
}
