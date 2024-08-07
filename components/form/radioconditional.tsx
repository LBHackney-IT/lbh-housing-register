import React from 'react';

import { Field, FieldInputProps, FieldMetaProps } from 'formik';

import {
  BaseFormField,
  ConditionalFormFieldOptionInput,
  RadioConditionalFormField,
} from '../../lib/types/form';
import Paragraph from '../content/paragraph';
import Details from '../details';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';

export const ConditionalInput = ({
  as,
  containerId,
  fieldId,
  fieldName,
  label,
  display,
}: ConditionalFormFieldOptionInput) => {
  return (
    <div
      className={`govuk-radios__conditional${display ? '' : '--hidden'}`}
      id={containerId}
    >
      <Label content={label} htmlFor={fieldId} />
      <Field
        className="govuk-input govuk-!-width-one-third"
        type={as}
        id={fieldId}
        name={fieldName}
        data-aria-controls={containerId}
      />
    </div>
  );
};

interface RadioProps extends BaseFormField {
  index?: number;
  value: string;
  containerId?: string;
}

export const Radio = ({
  index,
  hint,
  label,
  name,
  value,
  containerId,
}: RadioProps): JSX.Element => {
  let id = name;

  if (index !== undefined) {
    id += `.${index}`;
  }

  return (
    <div className="govuk-radios__item">
      <Field
        className="govuk-radios__input"
        type="radio"
        id={id}
        name={name}
        value={value}
        data-aria-controls={containerId}
      />
      <Label
        className="govuk-radios__label"
        content={label || value}
        htmlFor={id}
      />

      {hint && <Hint className="govuk-radios__hint" content={hint} />}
    </div>
  );
};

export interface RadioConditionalProps extends RadioConditionalFormField {
  value: string;
  subheading?: string;
}

export default function RadioConditional({
  hint,
  label,
  details,
  name,
  options,
  subheading,
  hideLabel,
}: RadioConditionalProps): JSX.Element {
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
          {label && <Label content={label} strong hideLabel={hideLabel} />}
          {hint && <Hint content={hint} />}
          {details && (
            <Details summary={details.title ?? 'Help with this question'}>
              {details.content}
            </Details>
          )}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}
          {subheading && <Paragraph>{subheading}</Paragraph>}
          <div className="govuk-radios lbh-radios">
            {options?.map((radio, index) => (
              <React.Fragment key={index}>
                <Radio
                  key={index}
                  index={index}
                  hint={radio.hint}
                  label={radio.label!}
                  name={field.name}
                  value={radio.value}
                  containerId={radio.conditionalFieldInput?.containerId}
                  hideLabel={hideLabel}
                />

                {radio.conditionalFieldInput && (
                  <ConditionalInput
                    as={radio.conditionalFieldInput.as}
                    containerId={radio.conditionalFieldInput.containerId}
                    fieldId={radio.conditionalFieldInput.fieldId}
                    fieldName={radio.conditionalFieldInput.fieldName}
                    label={radio.conditionalFieldInput.label}
                    display={meta.value == radio.value}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </FormGroup>
      )}
    </Field>
  );
}
