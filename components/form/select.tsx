import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import { ReactElement } from 'react';
import { SelectFormField } from '../../lib/types/form';
import Details from '../details';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import { v4 as uniqueID } from 'uuid';

export default function Select({
  hint,
  details,
  label,
  name,
  options,
  hideLabel,
  modifierClasses,
}: Omit<SelectFormField, 'as'>): ReactElement {
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
          {label && (
            <Label
              content={label}
              htmlFor={field.name}
              strong={true}
              hideLabel={hideLabel}
            />
          )}
          {hint && <Hint content={hint} />}
          {details && (
            <Details summary={details.title ?? 'Help with this question'}>
              {details.content}
            </Details>
          )}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

          <select
            className={`${
              !!meta.touched && !!meta.error ? 'govuk-select--error' : ''
            } ${
              modifierClasses ? modifierClasses : ''
            } govuk-select lbh-select`}
            id={field.name}
            {...field}
          >
            {options?.map((option) => (
              <option key={uniqueID()} value={option.value}>
                {option.label || option.value}
              </option>
            ))}
          </select>
        </FormGroup>
      )}
    </Field>
  );
}
