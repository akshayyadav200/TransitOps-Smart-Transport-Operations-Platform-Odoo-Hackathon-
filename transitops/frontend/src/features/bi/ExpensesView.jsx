import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";
import { Pagination } from "../../components/common/Pagination.jsx";
import { EXPENSE_CATEGORIES } from "./constants.js";
import { expenseApi, reportApi } from "./biApi.js";
import { ConfirmDialog, EmptyState, ErrorState, LoadingState } from "./components.jsx";
import { useGlobalFilters } from "./FiltersContext.jsx";
import { asDateInput, fieldErrors, formatCurrency, formatDate, formatNumber, normalizeId, tripLabel, vehicleLabel } from "./formatters.js";
import { usePagedResource } from "./usePagedResource.js";

const blankExpense = {
  vehicleId: "",
  tripId: "",
  category: "Maintenance",
  amount: "",
  description: "",
  date: asDateInput(new Date()),
  createdBy: ""
};

function ExpenseForm({ editing, options, saving, onCancel, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: blankExpense });

  useEffect(() => {
    if (editing) {
      reset({
        vehicleId: normalizeId(editing.vehicleId),
        tripId: normalizeId(editing.tripId),
        category: editing.category,
        amount: editing.amount,
        description: editing.description ?? "",
        date: asDateInput(editing.date),
        createdBy: editing.createdBy
      });
    } else {
      reset(blankExpense);
    }
  }, [editing, reset]);

  return (
    <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
      <label>
        Vehicle
        <select {...register("vehicleId", { required: "Vehicle is required" })}>
          <option value="">Select vehicle</option>
          {options.vehicles.map((vehicle) => (
            <option key={vehicle._id} value={vehicle._id}>
              {vehicleLabel(vehicle)}
            </option>
          ))}
        </select>
        {errors.vehicleId && <small>{errors.vehicleId.message}</small>}
      </label>
      <label>
        Trip
        <select {...register("tripId")}>
          <option value="">No trip</option>
          {options.trips.map((trip) => (
            <option key={trip._id} value={trip._id}>
              {tripLabel(trip)}
            </option>
          ))}
        </select>
      </label>
      <label>
        Category
        <select {...register("category", { required: true })}>
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label>
        Amount
        <input min="0.01" step="0.01" type="number" {...register("amount", { required: "Amount is required", min: 0.01 })} />
        {errors.amount && <small>Amount must be greater than zero</small>}
      </label>
      <label>
        Date
        <input type="date" {...register("date", { required: "Date is required" })} />
        {errors.date && <small>{errors.date.message}</small>}
      </label>
      <label>
        Created By
        <input maxLength={120} {...register("createdBy", { required: "Created by is required" })} />
        {errors.createdBy && <small>{errors.createdBy.message}</small>}
      </label>
      <label>
        Description
        <textarea maxLength={600} rows={4} {...register("description")} />
      </label>
      <div className="form-actions">
        <button className="button primary" disabled={saving} type="submit">
          {saving ? "Saving" : editing ? "Update Expense" : "Add Expense"}
        </button>
        {editing && (
          <button className="button secondary" onClick={onCancel} type="button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function ExpenseCards({ filters }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;
    expenseApi.categories(filters).then((response) => {
      if (mounted) {
        setCategories(response.data ?? []);
      }
    });

    return () => {
      mounted = false;
    };
  }, [filters]);

  return (
    <div className="expense-card-grid">
      {EXPENSE_CATEGORIES.map((category) => {
        const item = categories.find((row) => row.category === category);
        return (
          <article className="expense-card" key={category}>
            <span>{category}</span>
            <strong>{formatCurrency(item?.amount ?? 0)}</strong>
            <small>{formatNumber(item?.records ?? 0)} records</small>
          </article>
        );
      })}
    </div>
  );
}

function ExpenseTable({ items, loading, onEdit, onDelete, onSort }) {
  if (loading) {
    return <LoadingState label="Loading expenses" />;
  }

  if (items.length === 0) {
    return <EmptyState label="No expenses found" />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th><button className="sort-button" onClick={() => onSort("-date")} type="button">Date</button></th>
            <th>Vehicle</th>
            <th>Trip</th>
            <th><button className="sort-button" onClick={() => onSort("category")} type="button">Category</button></th>
            <th><button className="sort-button" onClick={() => onSort("-amount")} type="button">Amount</button></th>
            <th>Description</th>
            <th>Created By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{formatDate(item.date)}</td>
              <td>{vehicleLabel(item.vehicleId)}</td>
              <td>{tripLabel(item.tripId)}</td>
              <td>{item.category}</td>
              <td>{formatCurrency(item.amount)}</td>
              <td>{item.description ?? "-"}</td>
              <td>{item.createdBy}</td>
              <td>
                <div className="row-actions">
                  <button className="icon-button" onClick={() => onEdit(item)} title="Edit expense" type="button">
                    <FiEdit2 aria-hidden="true" />
                  </button>
                  <button className="icon-button danger-icon" onClick={() => onDelete(item)} title="Delete expense" type="button">
                    <FiTrash2 aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ExpensesView() {
  const { filters } = useGlobalFilters();
  const [options, setOptions] = useState({ vehicles: [], trips: [] });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fetchExpenses = useCallback((params) => expenseApi.list(params), []);
  const resource = usePagedResource(fetchExpenses, filters, { sort: "-date" });
  const mergedFilters = useMemo(() => ({ ...filters, ...resource.filters }), [filters, resource.filters]);

  useEffect(() => {
    reportApi.filters().then((response) => setOptions(response.data)).catch(() => setOptions({ vehicles: [], trips: [] }));
  }, []);

  async function submitExpense(values) {
    setSaving(true);

    try {
      const payload = {
        ...values,
        tripId: values.tripId || null,
        amount: Number(values.amount)
      };

      if (editing) {
        await expenseApi.update(editing._id, payload);
        toast.success("Expense updated");
      } else {
        await expenseApi.create(payload);
        toast.success("Expense added");
      }

      setEditing(null);
      await resource.load();
    } catch (error) {
      toast.error(error.message);
      Object.values(fieldErrors(error)).forEach((message) => toast.error(message));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    await expenseApi.remove(deleteTarget._id);
    toast.success("Expense deleted");
    setDeleteTarget(null);
    await resource.load();
  }

  return (
    <section className="bi-stack">
      <ExpenseCards filters={mergedFilters} />
      <div className="module-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Expense Module</p>
              <h2>Expense Records</h2>
            </div>
            <label className="search-field">
              <FiSearch aria-hidden="true" />
              <input
                placeholder="Search expenses"
                value={resource.filters.search ?? ""}
                onChange={(event) => resource.updateFilter("search", event.target.value)}
              />
            </label>
          </div>
          <ErrorState message={resource.error} />
          <ExpenseTable items={resource.items} loading={resource.loading} onDelete={setDeleteTarget} onEdit={setEditing} onSort={resource.setSort} />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </div>
        <aside className="panel side-panel">
          <p className="eyebrow">{editing ? "Edit Expense" : "Add Expense"}</p>
          <ExpenseForm editing={editing} options={options} saving={saving} onCancel={() => setEditing(null)} onSubmit={submitExpense} />
        </aside>
      </div>
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete ${deleteTarget.category} expense from ${formatDate(deleteTarget.date)}?`}
          title="Delete expense"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  );
}
