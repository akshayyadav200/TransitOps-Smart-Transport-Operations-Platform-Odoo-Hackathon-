import React from "react";
import { AlertTriangle, ChevronLeft, ChevronRight, LoaderCircle, PackageOpen } from "lucide-react";

const statusClassByValue = {
  Available: "success",
  Active: "success",
  Completed: "success",
  Dispatched: "info",
  Draft: "neutral",
  "On Trip": "info",
  "In Shop": "warning",
  "Off Duty": "neutral",
  Suspended: "danger",
  Cancelled: "danger",
  Retired: "neutral"
};

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <header className="page-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="summary">{description}</p> : null}
      </div>
      {actions ? <div className="page-actions">{actions}</div> : null}
    </header>
  );
}

export function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="loading-inline" role="status">
      <LoaderCircle size={20} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="skeleton-stack" aria-label="Loading content">
      {Array.from({ length: rows }, (_, index) => (
        <span className="skeleton-line" key={index} />
      ))}
    </div>
  );
}

export function EmptyState({ title = "No records found", message = "There is nothing to show yet.", action }) {
  return (
    <section className="state-page">
      <PackageOpen size={36} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </section>
  );
}

export function ErrorState({ title = "Something went wrong", message = "Please try again.", onRetry }) {
  return (
    <section className="state-page error-state">
      <AlertTriangle size={36} aria-hidden="true" />
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry ? (
        <button onClick={onRetry} type="button">
          Retry
        </button>
      ) : null}
    </section>
  );
}

export function StatusBadge({ value }) {
  const tone = statusClassByValue[value] ?? "neutral";
  return <span className={`status-badge ${tone}`}>{value ?? "N/A"}</span>;
}

export function ConfirmDialog({ cancelLabel = "Cancel", confirmLabel = "Confirm", message, onCancel, onConfirm, open, title }) {
  if (!open) {
    return null;
  }

  return (
    <div aria-modal="true" className="dialog-backdrop" role="dialog">
      <section className="confirm-dialog">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="dialog-actions">
          <button className="secondary-button" onClick={onCancel} type="button">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} type="button">
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

export function FormError({ message, errors = [] }) {
  if (!message && errors.length === 0) {
    return null;
  }

  return (
    <div className="form-error" role="alert">
      {message ? <p>{message}</p> : null}
      {errors.length > 0 ? (
        <ul>
          {errors.map((error) => (
            <li key={`${error.field ?? "field"}-${error.message}`}>{error.message}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function Pagination({ currentPage, onPageChange, pageCount }) {
  if (pageCount <= 1) {
    return null;
  }

  const previousDisabled = currentPage <= 1;
  const nextDisabled = currentPage >= pageCount;

  return (
    <nav aria-label="Pagination" className="pagination">
      <button disabled={previousDisabled} onClick={() => onPageChange(currentPage - 1)} type="button">
        <ChevronLeft size={16} aria-hidden="true" />
        <span>Previous</span>
      </button>
      <span>
        Page {currentPage} of {pageCount}
      </span>
      <button disabled={nextDisabled} onClick={() => onPageChange(currentPage + 1)} type="button">
        <span>Next</span>
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
