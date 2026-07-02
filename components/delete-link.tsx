import { useState } from 'react';
import Dialog from 'lbh-frontend/dialog';
import Paragraph from '../components/content/paragraph';

interface DeleteLinkProps {
  content: string;
  details?: string;
  onDelete: () => void;
  mainButtonTestId?: string;
  dialogConfirmButtonTestId?: string;
}

export default function DeleteLink({
  content,
  details,
  onDelete,
  mainButtonTestId: mainButtonDataTestId,
  dialogConfirmButtonTestId: dialogConfirmButtonDataTestId,
}: DeleteLinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="text-center">
        <button
          onClick={() => setOpen(true)}
          className="lbh-link lbh-link--no-visited-state lbh-delete-link"
          data-testid={mainButtonDataTestId}
        >
          {content}
        </button>
      </div>

      <Dialog
        isOpen={open}
        title="Are you sure?"
        onDismiss={() => setOpen(false)}
        onConfirm={onDelete}
        onCancel={() => setOpen(false)}
        confirmButtonTestId={dialogConfirmButtonDataTestId}
      >
        <Paragraph>{details}</Paragraph>
      </Dialog>
    </>
  );
}
