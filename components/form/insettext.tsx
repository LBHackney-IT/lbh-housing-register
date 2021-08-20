import { InsetTextFormField } from '../../lib/types/form';

export default function InsetText({
  title,
  content,
  list,
  removeBorder,
  borderColour,
  backgroundColour,
}: InsetTextFormField): JSX.Element {
  return (
    <div
      className="govuk-inset-text lbh-inset-text"
      style={{
        ...(removeBorder ? { borderLeft: 'none' } : {}),
        ...(borderColour && { borderLeft: '10px solid #' + borderColour }),
        ...(backgroundColour && { backgroundColor: '#' + backgroundColour }),
      }}
    >
      {title && <h3>{title}</h3>}
      {content && <p className="lbh-body-m">{content}</p>}
      {list && (
        <ul>
          {list.map((content: string, index: number) => (
            <li key={index}>{content}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
