import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import { TextareaFormField } from '../../lib/types/form';
import Details from '../details';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';

export default function Textarea({
  hint,
  details,
  label,
  name,
  placeholder,
  hideLabel,
}: TextareaFormField): JSX.Element {
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
            <Label content={label} htmlFor={field.name} strong={true} hideLabel={hideLabel} />
          )}
          {hint && <Hint content={hint} />}
          {details && (
            <Details summary={details.title ?? 'Help with this question'}>
              {details.content}
            </Details>
          )}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

          <textarea
            className={`${
              !!meta.touched && !!meta.error ? 'govuk-textarea--error' : ''
            } govuk-textarea lbh-textarea`}
            id={field.name}
            placeholder={placeholder}
            rows={5}
            {...field}
            maxLength={10000}
          />
        </FormGroup>
      )}
    </Field>
  );
}
