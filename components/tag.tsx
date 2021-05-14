interface TagProps {
  className?: string
  content: string
  variant?: "green" | "grey" | "red" | "yellow"
}

export default function Tag({ className, content, variant }: TagProps): JSX.Element {
  className = className || ""
  className += " govuk-tag lbh-tag"

  if (variant) {
    className += " lbh-tag--" + variant
  }

  return (
    <span className={className}>
      {content}
    </span>
  )
}