import { useState } from 'react';
import ErrorMessage from './error-message';
import FormGroup from './form-group';
import Hint from './hint';
import Label from './label';
import { FormField } from '../../lib/types/form';
import { Field, FieldInputProps, FieldMetaProps } from 'formik';
import Button from '../button';
import Paragraph from '../content/paragraph';

interface InputProps extends FormField {
  className?: string;
  person?: string;
}

export default function Input({
  className,
  hint,
  label,
  name,
  placeholder,
  type,
  person,
}: InputProps): JSX.Element {
  const [postCode, setPostCode] = useState();

  const onClick = () => {
    // TODO: Invoke Address Finder Hackney API call
    try {
    } catch (err) {
      // TODO: error handling
    }
  }
  
  const onChange = (e:any) => {
    setPostCode(e.target.value)
  }

  const postCodeFinder = name === 'address-finder';
  return (
    <div>
      <Field name={name}>
      {({
        field,
        meta,
      }: {
        field: FieldInputProps<string>;
        meta: FieldMetaProps<string>;
      }) => (
        <FormGroup error={!!meta.touched && !!meta.error}>
          {person && <Paragraph><strong>{person}</strong></Paragraph>}
          {label && <Label content={label} htmlFor={name} strong={true} />}
          {hint && <Hint content={hint} />}
          {meta.touched && meta.error && <ErrorMessage message={meta.error} />}

          {postCodeFinder ? 
            <input
              className={`${className} ${
                meta.touched && meta.error && 'govuk-input--error'
              } govuk-input lbh-input`}
              id={name}
              placeholder={placeholder}
              type={type}
              {...field}
              // onChange={onChange}
              // value={postCode}
            /> :
            <input
              className={`${className} ${
                meta.touched && meta.error && 'govuk-input--error'
              } govuk-input lbh-input`}
              id={name}
              placeholder={placeholder}
              type={type}
              {...field}
            />
          }
        </FormGroup>
      )}
    </Field>
    {postCodeFinder && (
      <Button
      onClick={() => onClick()}
      secondary={false}
      type="button"
      >
        Find Address
      </Button>
    )}
    </div>
  );
}
