import { useField } from 'formik';
import { FocusEvent, useRef, useState } from 'react';
import { DateFormField } from '../../lib/types/form';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';

export const INVALID_DATE = 'invalid date';

type DateInputProps = DateFormField & {
  showDay?: boolean;
};

export default function DateInput({
  hint,
  label,
  name,
  showDay = true,
  hideLabel,
}: Omit<DateInputProps, 'as'>): JSX.Element {
  const [field, meta, helpers] = useField<string>({
    name,
  });

  const dateVal = new Date(field.value);
  const invalid = isNaN(+dateVal) ? '' : undefined;

  const [d, setD] = useState(
    showDay ? invalid ?? dateVal.getDate().toString() : '1'
  );
  const [m, setM] = useState(invalid ?? (dateVal.getMonth() + 1).toString());
  const [y, setY] = useState(invalid ?? dateVal.getFullYear().toString());

  const dRef = useRef<HTMLInputElement>(null);
  const mRef = useRef<HTMLInputElement>(null);
  const yRef = useRef<HTMLInputElement>(null);

  const [touched, setTouched] = useState(false);

  function setValue(newD: string, newM: string, newY: string) {
    setD(newD);
    setM(newM);
    setY(newY);
    setTouched(true);

    if (!newD || !newM || !newY) {
      helpers.setValue('');
      return;
    }

    const newDate = new Date(
      Date.UTC(Number(newY), Number(newM) - 1, Number(newD))
    );

    if (
      newDate.getFullYear() !== Number(newY) ||
      newDate.getMonth() !== Number(newM) - 1 ||
      newDate.getDate() !== Number(newD) ||
      isNaN(+newDate)
    ) {
      helpers.setValue(INVALID_DATE);
      helpers.setTouched(true);
      return;
    }
    helpers.setValue(newDate.toISOString());
  }

  function onBlur(e: FocusEvent) {
    if (
      e.relatedTarget !== dRef.current &&
      e.relatedTarget !== mRef.current &&
      e.relatedTarget !== yRef.current
    ) {
      if (touched) {
        helpers.setTouched(true);
      }
      field.onBlur(e);
    }
  }

  return (
    <FormGroup error={!!meta.touched && !!meta.error}>
      {label && <Label content={label} strong={true} hideLabel={hideLabel} />}
      {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

      <fieldset className="govuk-fieldset" role="group">
        {hint && <Hint content={hint} />}
        <div className="govuk-date-input lbh-date-input" id="current-address">
          <div className="govuk-date-input__item">
            <div className="govuk-form-group">
              {showDay && (
                <div style={{ display: 'inline-block', padding: '0 20px 0 0' }}>
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor={`${field.name}-day`}
                  >
                    Day
                  </label>
                  <input
                    className="govuk-input govuk-date-input__input govuk-input--width-2"
                    id={`${field.name}-day`}
                    type="text"
                    pattern="[0-9]{1,2}"
                    inputMode="numeric"
                    onChange={(e) => setValue(e.target.value, m, y)}
                    value={d}
                    onBlur={onBlur}
                    ref={dRef}
                    data-testid="test-date-input-day"
                  />
                </div>
              )}

              <div style={{ display: 'inline-block', padding: '0 20px 0 0' }}>
                <label
                  className="govuk-label govuk-date-input__label"
                  htmlFor={`${field.name}-month`}
                >
                  Month
                </label>
                <input
                  className="govuk-input govuk-date-input__input govuk-input--width-2"
                  id={`${field.name}-month`}
                  type="text"
                  pattern="[0-9]{1,2}"
                  inputMode="numeric"
                  onChange={(e) => setValue(d, e.target.value, y)}
                  value={m}
                  onBlur={onBlur}
                  ref={mRef}
                  data-testid="test-date-input-month"
                />
              </div>

              <div style={{ display: 'inline-block', padding: '0 20px 0 0' }}>
                <label
                  className="govuk-label govuk-date-input__label"
                  htmlFor={`${field.name}-year`}
                >
                  Year
                </label>
                <input
                  className="govuk-input govuk-date-input__input govuk-input--width-4"
                  id={`${field.name}-year`}
                  type="text"
                  pattern="[0-9]{4}"
                  inputMode="numeric"
                  onChange={(e) => setValue(d, m, e.target.value)}
                  value={y}
                  onBlur={onBlur}
                  ref={yRef}
                  data-testid="test-date-input-year"
                />
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    </FormGroup>
  );
}
