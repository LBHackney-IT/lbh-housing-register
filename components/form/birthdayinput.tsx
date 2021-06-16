import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import ErrorMessage from './error-message';


export function BirthdayInputFields({
  index,
  hint,
  label,
  name,
  value,
}: any): JSX.Element {
  let id = name;

  if (index !== undefined) {
    id += `.${index}`;
  }

  return (
    <div style={{display: "inline-block", "padding": "0 20px 0 0"}}>
      <label className="govuk-label govuk-date-input__label" htmlFor="dob-day">
        {label}
      </label>
      <Field
        className={label === "Year" ? "govuk-input govuk-date-input__input govuk-input--width-4" : "govuk-input govuk-date-input__input govuk-input--width-2"}
        type="text"
        id={id}
        name={id}
        inputMode="numeric"
      />
    </div>
  );
}



export default function BirthdayInput({
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
            <fieldset className="govuk-fieldset" role="group" aria-describedby="dob-hint">
              <span id="dob-hint" className="govuk-hint lbh-hint">
                For example, 31 3 1980
              </span>
              <div className="govuk-date-input lbh-date-input" id="dob">

                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    {options?.map((options:any, index:any) => (
                      <BirthdayInputFields
                        key={index}
                        index={index}
                        hint={options.hint}
                        label={options.label!}
                        name={field.name}
                        value={options.value}
                      />
                    ))}
                  </div>
                </div>
               
              </div>
            </fieldset>
          </div>
        </FormGroup>
      )}
    </Field>
  );
}

