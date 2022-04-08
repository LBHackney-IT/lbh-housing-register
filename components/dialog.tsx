import React from 'react';
import { Dialog as ReachDialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import Button from './button';
import { HeadingThree } from './content/headings';

interface DialogProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onCancelText?: string;
  onConfirmationText?: string;
  onCancel?: () => void;
  onConfirmation?: () => void;
}

export default function Dialog({
  isOpen,
  title,
  children,
  onCancelText,
  onConfirmationText,
  onCancel,
  onConfirmation,
}: DialogProps) {
  return (
    <ReachDialog
      isOpen={isOpen}
      onDismiss={onCancel}
      aria-label={title}
      className="lbh-dialog"
    >
      {title && <HeadingThree content={title} />}
      {children}

      <div className="lbh-dialog__actions">
        {onConfirmation && (
          <Button onClick={onConfirmation}>
            {onConfirmationText === undefined ? 'Yes' : onConfirmationText}
          </Button>
        )}

        {onCancel && (
          <button
            onClick={onCancel}
            className="lbh-link lbh-link--no-visited-state"
          >
            {onCancelText === undefined ? 'No, cancel' : onCancelText}
          </button>
        )}
      </div>

      <button onClick={onCancel} className="lbh-dialog__close">
        <span className="govuk-visually-hidden">Close</span>

        <svg width="18" height="18" viewBox="0 0 13 13" fill="none">
          <path
            d="M-0.0501709 1.36379L1.36404 -0.050415L12.6778 11.2633L11.2635 12.6775L-0.0501709 1.36379Z"
            fill="#0B0C0C"
          />
          <path
            d="M11.2635 -0.050293L12.6778 1.36392L1.36404 12.6776L-0.0501709 11.2634L11.2635 -0.050293Z"
            fill="#0B0C0C"
          />
        </svg>
      </button>
    </ReachDialog>
  );
}
