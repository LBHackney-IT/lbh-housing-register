import { useState } from 'react';
import Dialog from './dialog';

interface DeleteLinkProps {
  content: string;
  onDelete: () => void;
}

export default function DeleteLink({ content, onDelete }: DeleteLinkProps) {
  const [confirmation, setConfirmation] = useState(false);

  if (confirmation) {
    const onConfirmation = () => onDelete();

    return (
      <Dialog
        title="Are you sure?"
        copy="This record will be permanently deleted"
        onConfirmation={onConfirmation}
        onCancel={() => setConfirmation(false)}
      />
    );
  }

  return (
    <div className="text-center">
      <a onClick={() => setConfirmation(true)}>
        <span className="govuk-error-message lbh-error-message">{content}</span>
      </a>
    </div>
  );
}
