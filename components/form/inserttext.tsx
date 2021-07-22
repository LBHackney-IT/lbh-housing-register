export default function InsertText({ title, content, list }: any): JSX.Element {
  return (
    <div className="govuk-inset-text lbh-inset-text">
      {title && <h3>{title}</h3>}
      {content && <p className="lbh-body-m">{content}</p>}
      {list &&
        list.map((f: string) => {
          return <li>{f}</li>;
        })}
    </div>
  );
}
