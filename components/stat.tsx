export interface StatProps {
  index?: number,
  value: string
  caption: string
}

export default function Stats({ index, value, caption }: StatProps): JSX.Element {
  return (
    <div className="lbh-stat">
      <strong className="lbh-stat__value" aria-labelledby={`stat-${index}-caption`}>
        {value}
      </strong>
      <span className="lbh-stat__caption" id={`stat-${index}-caption`}>
        {caption}
      </span>
    </div>
  )
}
