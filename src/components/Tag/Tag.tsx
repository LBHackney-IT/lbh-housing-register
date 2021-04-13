import "./Tag.scss"

type TagProps = {
  className?: string
  content: string
}

const Tag = ({ className, content }: TagProps): JSX.Element => {
  return (
    <span className={className + " govuk-tag lbh-tag"}>
      {content}
    </span>
  )
}

export default Tag