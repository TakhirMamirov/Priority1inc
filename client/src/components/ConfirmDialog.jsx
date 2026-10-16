import { useEffect, useRef } from 'react';

// Built on the native <dialog>: it brings the modal backdrop, focus trapping and
// Esc-to-cancel for free. Focus starts on Cancel, the safe choice for deletes.
export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current.open) ref.current.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      onCancel={onCancel}
      onClick={(e) => e.target === ref.current && onCancel()}
    >
      <div className="content">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="actions">
          <button autoFocus onClick={onCancel}>Cancel</button>
          <button className="danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </dialog>
  );
}
