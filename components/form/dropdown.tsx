import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import ErrorMessage from './error-message';


export default function Dropdown({
  hint,
  label,
  name,
  options,
}: any): JSX.Element {
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
          {label && <Label content={label} strong={true} />}
          {hint && <Hint content={hint} />}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

          <div className="govuk-form-group lbh-form-group">
            <Field as="select" name={name} className="govuk-select lbh-select">
              {options.map((relationship: any, index: number) => {
                return <option value={relationship.value} key={index}>{relationship.label}</option>
                
              })}
             
            </Field>
          </div>

        </FormGroup>
      )}
    </Field>
  );
}