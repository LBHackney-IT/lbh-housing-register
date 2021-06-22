import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import ErrorMessage from './error-message';


export function DateInputs({
  index,
  label,
  name,
  value,
  timeAtAdress
}: any): JSX.Element {
  let id = name;

  if (index !== undefined) {
    id += `.${index}`;
  }

  // const onChangeHandler = (e:any) => {
  //   console.log('hello', e.target.value)
  //   timeAtAdress(e.target.value)
  // }

  return (
    <div style={{display: "inline-block", "padding": "0 20px 0 0"}}>
      <label className="govuk-label govuk-date-input__label" htmlFor={value}>
        {label}
      </label>
      <Field
        className="govuk-input govuk-date-input__input govuk-input--width-2"
        id={id}
        name={id}
        type="text"
        pattern="[0-9]*"
        inputMode="numeric"
        // onChange={onChangeHandler}
      />
    </div>
  );
}


export default function DateInput({
  hint,
  label,
  name,
  options,
  timeAtAdress,
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
            <fieldset className="govuk-fieldset" role="group" aria-describedby="hint">
              <span id="address-hint" className="govuk-hint lbh-hint">
                For example, 01 03
              </span>
              <div className="govuk-date-input lbh-date-input" id="current-address">
                <div className="govuk-date-input__item">
                  <div className="govuk-form-group">
                    {options?.map((options:any, index:number) => (
                      <DateInputs
                        key={index}
                        index={index}
                        label={options.label!}
                        name={field.name}
                        value={options.value}
                        timeAtAdress={timeAtAdress}
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
