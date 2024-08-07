import { Field, FieldInputProps, FieldMetaProps } from 'formik';

import { BaseFormField, RadioFormField } from '../../lib/types/form';
import Paragraph from '../content/paragraph';
import Details from '../details';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';

interface RadioProps extends BaseFormField {
  index?: number;
  value: string;
}

export const Radio = ({
  index,
  hint,
  label,
  name,
  value,
}: RadioProps): JSX.Element => {
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
};

export interface RadiosProps extends RadioFormField {
  subheading?: string;
}

export default function Radios({
  hint,
  label,
  details,
  name,
  options,
  subheading,
  hideLabel,
}: Omit<RadiosProps, 'as'>): JSX.Element {
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
          {label && <Label content={label} strong hideLabel={hideLabel} />}
          {hint && <Hint content={hint} />}
          {details && (
            <Details summary={details.title ?? 'Help with this question'}>
              {details.content}
            </Details>
          )}
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
                hideLabel={hideLabel}
              />
            ))}
          </div>
        </FormGroup>
      )}
    </Field>
  );
}
