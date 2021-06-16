import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import ErrorMessage from './error-message';



export function BirthdayInputs({
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
    <input
      className="govuk-input govuk-date-input__input govuk-input--width-2"
      id={name}
      type="text"
      pattern="[0-9]*"
      inputMode="numeric"
    />
  );
}



export default function BirthdayInput({
  hint,
  label,
  name,
}: any): JSX.Element {
  console.log('birthdayinput name', name)

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
              {/* <legend className="govuk-fieldset__legend">Date of birth</legend> */}
              <span id="dob-hint" className="govuk-hint lbh-hint">
                For example, 31 3 1980
              </span>
              <div className="govuk-date-input lbh-date-input" id="dob">
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" htmlFor="dob-day">
                      Day
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      id="dob-day"
                      // name="dob-day"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      {...field}
                    />
                  </div>
                </div>
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" htmlFor="dob-month">
                      Month
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      id="dob-month"
                      // name="dob-month"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      {...field}
                    />
                  </div>
                </div>
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" htmlFor="dob-year">
                      Year
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-4"
                      id="dob-year"
                      // name="dob-year"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      {...field}
                    />
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

