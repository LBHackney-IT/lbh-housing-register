import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import ErrorMessage from './error-message';
// import { useState } from 'react';



export function Input({
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



export default function DateInput({
  hint,
  label,
  name,
}: any): JSX.Element {
  // const [months, setMonths] = useState()

  // const onMonthChange = (e:any) => {
  //   console.log('yo', e.target.value)
  //   setMonths(e.target.value)
  // }

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
            <fieldset className="govuk-fieldset" role="group" aria-describedby="hint">
              <span id="address-hint" className="govuk-hint lbh-hint">
                For example, 01 03
              </span>
              <div className="govuk-date-input lbh-date-input" id="current-address">
                <div className="govuk-date-input__item">
              
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" htmlFor="years">
                      Years
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      id={name}
                      type="text"
                      // pattern="[0-9]*"
                      inputMode="numeric"
                      {...field}
                      value="03"
                    />
                  </div>
                </div>
                
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    <label className="govuk-label govuk-date-input__label" htmlFor="months">
                      Months
                    </label>
                    <input
                      className="govuk-input govuk-date-input__input govuk-input--width-2"
                      id={name}
                      type="text"
                      // pattern="[0-9]"
                      inputMode="numeric"
                      {...field}
                      value="02"
                      // onChange={onMonthChange}
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
