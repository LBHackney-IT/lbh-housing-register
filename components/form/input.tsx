import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import { useState } from 'react';
import { TextFormField } from '../../lib/types/form';
import Button from '../button';
import Paragraph from '../content/paragraph';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';

interface InputProps extends TextFormField {
  className?: string;
  person?: string;
}

export default function Input({
  className,
  hint,
  label,
  name,
  placeholder,
  type,
  person,
}: InputProps): JSX.Element {
  return (
    <div>
      <Field name={name}>
        {({
          field,
          meta,
        }: {
          field: FieldInputProps<string>;
          meta: FieldMetaProps<string>;
        }) => (
          <FormGroup error={!!meta.touched && !!meta.error}>
            {person && (
              <Paragraph>
                <strong>{person}</strong>
              </Paragraph>
            )}
            {label && <Label content={label} htmlFor={name} strong={true} />}
            {hint && <Hint content={hint} />}
            {meta.touched && meta.error && (
              <ErrorMessage message={meta.error} />
            )}
            <input
              className={`${className} ${
                meta.touched && meta.error && 'govuk-input--error'
              } govuk-input lbh-input`}
              id={name}
              placeholder={placeholder}
              type={type}
              {...field}
            />
          </FormGroup>
        )}
      </Field>
    </div>
  );
}
