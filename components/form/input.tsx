import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import { InputHTMLAttributes, ReactNode } from 'react';
import { TextFormField } from '../../lib/types/form';
import Paragraph from '../content/paragraph';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';

type InputProps = Omit<TextFormField, 'label'> &
  InputHTMLAttributes<HTMLInputElement> & {
    person?: string;
    label?: ReactNode;
  };

export default function Input({
  className,
  hint,
  label,
  name,
  placeholder,
  type,
  person,
  hideLabel,
  ...additionalInputProps
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
            {!hideLabel && label && (
              <Label content={label} htmlFor={name} strong={true} />
            )}
            {hint && <Hint content={hint} />}
            {meta.touched && meta.error && (
              <ErrorMessage message={meta.error} />
            )}
            <input
              // Lowest priority to prevent accidental override of component defined props
              {...additionalInputProps}
              className={`${className} ${
                meta.touched && meta.error && 'govuk-input--error'
              } govuk-input lbh-input`}
              id={name}
              placeholder={placeholder}
              type={type}
              {...field}
              maxLength={500}
            />
          </FormGroup>
        )}
      </Field>
    </div>
  );
}
