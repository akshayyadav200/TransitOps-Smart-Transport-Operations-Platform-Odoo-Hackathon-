export function Pagination({ pagination, onPageChange }) {
  if (!pagination) {
    return null;
  }

  return (
    <div className="pagination">
      <span>
        Page {pagination.page} of {pagination.totalPages} - {pagination.total} records
      </span>
      <div className="pagination-actions">
        <button
          className="button secondary"
          disabled={!pagination.hasPreviousPage}
          onClick={() => onPageChange(pagination.page - 1)}
          type="button"
        >
          Previous
        </button>
        <button
          className="button secondary"
          disabled={!pagination.hasNextPage}
          onClick={() => onPageChange(pagination.page + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

