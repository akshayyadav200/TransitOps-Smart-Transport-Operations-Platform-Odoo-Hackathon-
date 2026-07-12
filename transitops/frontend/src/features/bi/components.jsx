import { FiAlertCircle, FiInbox, FiLoader } from "react-icons/fi";

export function LoadingState({ label = "Loading data" }) {
  return (
    <div className="state-box" role="status">
      <FiLoader className="spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ label = "No records found" }) {
  return (
    <div className="state-box">
      <FiInbox aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="state-box error-state" role="alert">
      <FiAlertCircle aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export function KpiCard({ icon: Icon, label, value, caption, accent = "green" }) {
  return (
    <article className={`kpi-card accent-${accent}`}>
      <div className="kpi-icon">{Icon && <Icon aria-hidden="true" />}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {caption && <small>{caption}</small>}
      </div>
    </article>
  );
}

export function ConfirmDialog({ title, message, confirmLabel = "Delete", onCancel, onConfirm }) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="form-actions">
          <button className="button secondary" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="button danger" onClick={onConfirm} type="button">
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
