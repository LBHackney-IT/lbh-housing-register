import Button from "./button"
import { HeadingTwo } from "./content/headings"
import Paragraph from "./content/paragraph"

interface DialogProps {
  copy?: string
  title?: string
  onCancel?: () => void
  onConfirmation: () => void
}

export default function Dialog({ copy, title, onCancel, onConfirmation }: DialogProps) {
  return (
    <div className="lbh-dialog" aria-modal="true" aria-label="Are you sure?" role="dialog">
      {title && <HeadingTwo content={title} />}
      {copy && <Paragraph>{copy}</Paragraph>}

      <div className="lbh-dialog__actions">
        <a onClick={onConfirmation} className="govuk-button lbh-button">
          Yes
        </a>
        
        {onCancel && 
          <Button className="lbh-link lbh-link--no-visited-state" onClick={onCancel}>
            No, cancel
          </Button>
        }
      </div>
    </div>
  )
}