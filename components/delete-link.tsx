import { useState } from 'react';
import Paragraph from '../components/content/paragraph';
import Dialog from './dialog';

interface DeleteLinkProps {
  content: string;
  details?: string;
  onDelete: () => void;
}

export default function DeleteLink({
  content,
  details,
  onDelete,
}: DeleteLinkProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="text-center">
        <button
          onClick={() => setOpen(true)}
          className="lbh-link lbh-link--no-visited-state lbh-delete-link"
        >
          {content}
        </button>
      </div>

      <Dialog
        isOpen={open}
        title="Are you sure?"
        onConfirmation={onDelete}
        onCancel={() => setOpen(false)}
      >
        <Paragraph>{details}</Paragraph>
      </Dialog>
    </>
  );
}
