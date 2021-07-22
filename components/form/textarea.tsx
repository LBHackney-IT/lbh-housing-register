import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import { TextareaFormField } from '../../lib/types/form';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import Details from '../details';

export default function Textarea({
  hint,
  details,
  label,
  name,
  placeholder,
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
            <Label content={label} htmlFor={field.name} strong={true} />
          )}
          {hint && <Hint content={hint} />}
          {details && (
            <Details summary="Help with this question">{details}</Details>
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
          />
        </FormGroup>
      )}
    </Field>
  );
}
