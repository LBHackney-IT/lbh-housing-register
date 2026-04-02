import * as RadixDialog from '@radix-ui/react-dialog';
import React from 'react';
import Button from './button';

interface DialogProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onCancelText?: string;
  onConfirmationText?: string;
  onCancel?: () => void;
  onConfirmation?: () => void;
  confirmationButtonTestId?: string;
}

export default function Dialog({
  isOpen,
  title,
  children,
  onCancelText,
  onConfirmationText,
  onCancel,
  onConfirmation,
  confirmationButtonTestId,
}: DialogProps) {
  return (
    <RadixDialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onCancel?.();
        }
      }}
    >
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="lbh-dialog-overlay" />
        <RadixDialog.Content
          className="lbh-dialog lbh-dialog--radix"
          aria-describedby={undefined}
        >
          {title ? (
            <RadixDialog.Title asChild>
              <h3 className="lbh-heading-h3">{title}</h3>
            </RadixDialog.Title>
          ) : (
            <RadixDialog.Title className="govuk-visually-hidden">
              Dialog
            </RadixDialog.Title>
          )}
          {children}

          <div className="lbh-dialog__actions">
            {onConfirmation && (
              <Button
                onClick={onConfirmation}
                dataTestId={confirmationButtonTestId}
              >
                {onConfirmationText === undefined ? 'Yes' : onConfirmationText}
              </Button>
            )}

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="lbh-link lbh-link--no-visited-state"
              >
                {onCancelText === undefined ? 'No, cancel' : onCancelText}
              </button>
            )}
          </div>

          <RadixDialog.Close asChild>
            <button
              type="button"
              className="lbh-dialog__close"
              aria-label="Close"
            >
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
          </RadixDialog.Close>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
