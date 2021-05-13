interface DeleteLinkProps {
  content: string
  onDelete: () => void
}

export default function DeleteLink({ content, onDelete }: DeleteLinkProps) {
  return (
    <div className="text-center">
      <a onClick={onDelete}>
        <span className="govuk-error-message lbh-error-message">
          {content}
        </span>
      </a>
    </div>
  )
}