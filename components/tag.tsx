interface TagProps {
  className?: string
  content: string 
}

export default function Tag({ className, content }: TagProps): JSX.Element {
  return (
    <span className={className + " govuk-tag lbh-tag"}>
      {content}
    </span>
  )
}