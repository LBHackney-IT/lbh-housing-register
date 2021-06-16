import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import ErrorMessage from './error-message';


export default function Dropdown({
  hint,
  label,
  name,
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
            <select className="govuk-select lbh-select" id="select-1" name={name}>
              <option value="1">Parent</option>
              <option value="2" selected>Husband/Wife</option>
              <option value="3" disabled>Child</option>
            </select>
          </div>

        </FormGroup>
      )}
    </Field>
  );
}