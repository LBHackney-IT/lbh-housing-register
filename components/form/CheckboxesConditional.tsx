import React from 'react';
import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import {
  BaseFormField,
  CheckboxesConditionalFormField,
  ConditionalFormFieldOptionInput,
} from '../../lib/types/form';
import Paragraph from '../content/paragraph';
import Details from '../details';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import Textarea from './textarea';

export function ConditionalInput({
  as,
  containerId,
  fieldId,
  fieldName,
  label,
  display,
}: ConditionalFormFieldOptionInput) {
  return (
    <div
      className={'govuk-checkboxes__conditional' + (display ? '' : '--hidden')}
      data-testid={`test-checkbox-conditional-container-${containerId}`}
      id={containerId}
    >
      {as === 'textarea' ? (
        <Textarea as="textarea" name={fieldName!} label={label!} />
      ) : (
        <>
          <Label content={label} htmlFor={fieldId} />
          <Field
            className="govuk-input govuk-!-width-one-third"
            type={as}
            id={fieldId}
            name={fieldName}
            data-aria-controls={containerId}
          />
        </>
      )}
    </div>
  );
}

interface CheckboxProps extends BaseFormField {
  index?: number;
  value: string;
  containerId?: string;
}

export function Checkbox({
  index,
  hint,
  label,
  name,
  value,
  containerId,
}: CheckboxProps): JSX.Element {
  let id = name;

  if (index !== undefined) {
    id += `.${index}`;
  }

  return (
    <div
      className="govuk-checkboxes__item"
      data-testid={`test-checkbox-conditional-${id}`}
    >
      <Field
        className="govuk-checkboxes__input"
        type="checkbox"
        id={id}
        name={name}
        value={value}
        data-aria-controls={containerId}
      />
      <Label
        className="govuk-checkboxes__label"
        content={label || value}
        htmlFor={id}
      />

      {hint && <Hint className="govuk-checkboxes__hint" content={hint} />}
    </div>
  );
}

export interface CheckboxesConditionalProps
  extends CheckboxesConditionalFormField {
  value: string;
  subheading?: string;
}

export default function CheckboxesConditional({
  hint,
  label,
  details,
  name,
  options,
  subheading,
  hideLabel,
}: CheckboxesConditionalProps): JSX.Element {
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
            <Label content={label} strong={true} hideLabel={hideLabel} />
          )}
          {hint && <Hint content={hint} />}
          {details && (
            <Details summary={details.title ?? 'Help with this question'}>
              {details.content}
            </Details>
          )}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}
          {subheading && <Paragraph>{subheading}</Paragraph>}
          <div className="govuk-checkboxes lbh-checkboxes">
            {options?.map((radio, index) => (
              <React.Fragment key={index}>
                <Checkbox
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
