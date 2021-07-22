export default function InsetText({ title, content, list }: any): JSX.Element {
  return (
    <div className="govuk-inset-text lbh-inset-text">
      {title && <h3>{title}</h3>}
      {content && <p className="lbh-body-m">{content}</p>}
      {list &&
        list.map((content: string, index: number) => {
          return <li key={index}>{content}</li>;
        })}
    </div>
  );
}
