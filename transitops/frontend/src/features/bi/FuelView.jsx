import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";
import { Pagination } from "../../components/common/Pagination.jsx";
import { FUEL_TYPES } from "./constants.js";
import { fuelApi, reportApi } from "./biApi.js";
import { ConfirmDialog, EmptyState, ErrorState, LoadingState } from "./components.jsx";
import { useGlobalFilters } from "./FiltersContext.jsx";
import { asDateInput, fieldErrors, formatCurrency, formatDate, formatNumber, normalizeId, tripLabel, vehicleLabel } from "./formatters.js";
import { usePagedResource } from "./usePagedResource.js";

const blankFuel = {
  vehicleId: "",
  tripId: "",
  liters: "",
  cost: "",
  fuelType: "Diesel",
  date: asDateInput(new Date()),
  odometer: "",
  filledBy: ""
};

function FuelForm({ editing, options, saving, onCancel, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: blankFuel });

  useEffect(() => {
    if (editing) {
      reset({
        vehicleId: normalizeId(editing.vehicleId),
        tripId: normalizeId(editing.tripId),
        liters: editing.liters,
        cost: editing.cost,
        fuelType: editing.fuelType,
        date: asDateInput(editing.date),
        odometer: editing.odometer,
        filledBy: editing.filledBy
      });
    } else {
      reset(blankFuel);
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
        Liters
        <input min="0.01" step="0.01" type="number" {...register("liters", { required: "Liters are required", min: 0.01 })} />
        {errors.liters && <small>Liters must be greater than zero</small>}
      </label>
      <label>
        Cost
        <input min="0.01" step="0.01" type="number" {...register("cost", { required: "Cost is required", min: 0.01 })} />
        {errors.cost && <small>Cost must be greater than zero</small>}
      </label>
      <label>
        Fuel Type
        <select {...register("fuelType", { required: true })}>
          {FUEL_TYPES.map((fuelType) => (
            <option key={fuelType} value={fuelType}>
              {fuelType}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date
        <input type="date" {...register("date", { required: "Date is required" })} />
        {errors.date && <small>{errors.date.message}</small>}
      </label>
      <label>
        Odometer
        <input min="0" step="1" type="number" {...register("odometer", { required: "Odometer is required", min: 0 })} />
        {errors.odometer && <small>Odometer cannot be negative</small>}
      </label>
      <label>
        Filled By
        <input maxLength={120} {...register("filledBy", { required: "Filled by is required" })} />
        {errors.filledBy && <small>{errors.filledBy.message}</small>}
      </label>
      <div className="form-actions">
        <button className="button primary" disabled={saving} type="submit">
          {saving ? "Saving" : editing ? "Update Fuel" : "Add Fuel"}
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

function FuelTable({ items, loading, onEdit, onDelete, onSort }) {
  if (loading) {
    return <LoadingState label="Loading fuel records" />;
  }

  if (items.length === 0) {
    return <EmptyState label="No fuel records found" />;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th><button className="sort-button" onClick={() => onSort("-date")} type="button">Date</button></th>
            <th>Vehicle</th>
            <th>Trip</th>
            <th><button className="sort-button" onClick={() => onSort("fuelType")} type="button">Fuel</button></th>
            <th><button className="sort-button" onClick={() => onSort("-liters")} type="button">Liters</button></th>
            <th><button className="sort-button" onClick={() => onSort("-cost")} type="button">Cost</button></th>
            <th>Odometer</th>
            <th>Filled By</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{formatDate(item.date)}</td>
              <td>{vehicleLabel(item.vehicleId)}</td>
              <td>{tripLabel(item.tripId)}</td>
              <td>{item.fuelType}</td>
              <td>{formatNumber(item.liters)}</td>
              <td>{formatCurrency(item.cost)}</td>
              <td>{formatNumber(item.odometer, { maximumFractionDigits: 0 })}</td>
              <td>{item.filledBy}</td>
              <td>
                <div className="row-actions">
                  <button className="icon-button" onClick={() => onEdit(item)} title="Edit fuel" type="button">
                    <FiEdit2 aria-hidden="true" />
                  </button>
                  <button className="icon-button danger-icon" onClick={() => onDelete(item)} title="Delete fuel" type="button">
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

function FuelSummary({ filters }) {
  const [vehicleWise, setVehicleWise] = useState([]);
  const [tripWise, setTripWise] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([fuelApi.vehicleWise(filters), fuelApi.tripWise(filters)]).then(([vehicles, trips]) => {
      if (mounted) {
        setVehicleWise(vehicles.data ?? []);
        setTripWise(trips.data ?? []);
      }
    });

    return () => {
      mounted = false;
    };
  }, [filters]);

  return (
    <div className="summary-grid">
      <article className="panel flat-panel">
        <h2>Vehicle Wise Fuel</h2>
        {vehicleWise.length === 0 ? <EmptyState label="No vehicle fuel data" /> : vehicleWise.slice(0, 5).map((row) => (
          <div className="summary-row" key={row._id}>
            <span>{vehicleLabel(row.vehicle)}</span>
            <strong>{formatCurrency(row.cost)}</strong>
            <small>{formatNumber(row.liters)} L</small>
          </div>
        ))}
      </article>
      <article className="panel flat-panel">
        <h2>Trip Wise Fuel</h2>
        {tripWise.length === 0 ? <EmptyState label="No trip fuel data" /> : tripWise.slice(0, 5).map((row) => (
          <div className="summary-row" key={row._id}>
            <span>{tripLabel(row.trip)}</span>
            <strong>{formatCurrency(row.cost)}</strong>
            <small>{formatNumber(row.liters)} L</small>
          </div>
        ))}
      </article>
    </div>
  );
}

export function FuelView() {
  const { filters } = useGlobalFilters();
  const [options, setOptions] = useState({ vehicles: [], trips: [] });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fetchFuel = useCallback((params) => fuelApi.list(params), []);
  const resource = usePagedResource(fetchFuel, filters, { sort: "-date" });
  const mergedFilters = useMemo(() => ({ ...filters, ...resource.filters }), [filters, resource.filters]);

  useEffect(() => {
    reportApi.filters().then((response) => setOptions(response.data)).catch(() => setOptions({ vehicles: [], trips: [] }));
  }, []);

  async function submitFuel(values) {
    setSaving(true);

    try {
      const payload = {
        ...values,
        tripId: values.tripId || null,
        liters: Number(values.liters),
        cost: Number(values.cost),
        odometer: Number(values.odometer)
      };

      if (editing) {
        await fuelApi.update(editing._id, payload);
        toast.success("Fuel record updated");
      } else {
        await fuelApi.create(payload);
        toast.success("Fuel record added");
      }

      setEditing(null);
      await resource.load();
    } catch (error) {
      toast.error(error.message);
      const errors = fieldErrors(error);
      Object.values(errors).forEach((message) => toast.error(message));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    await fuelApi.remove(deleteTarget._id);
    toast.success("Fuel record deleted");
    setDeleteTarget(null);
    await resource.load();
  }

  return (
    <section className="bi-stack">
      <div className="module-grid">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Fuel Module</p>
              <h2>Fuel Records</h2>
            </div>
            <label className="search-field">
              <FiSearch aria-hidden="true" />
              <input
                placeholder="Search fuel records"
                value={resource.filters.search ?? ""}
                onChange={(event) => resource.updateFilter("search", event.target.value)}
              />
            </label>
          </div>
          <ErrorState message={resource.error} />
          <FuelTable items={resource.items} loading={resource.loading} onDelete={setDeleteTarget} onEdit={setEditing} onSort={resource.setSort} />
          <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
        </div>
        <aside className="panel side-panel">
          <p className="eyebrow">{editing ? "Edit Fuel" : "Add Fuel"}</p>
          <FuelForm editing={editing} options={options} saving={saving} onCancel={() => setEditing(null)} onSubmit={submitFuel} />
        </aside>
      </div>
      <FuelSummary filters={mergedFilters} />
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete fuel record from ${formatDate(deleteTarget.date)}?`}
          title="Delete fuel record"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </section>
  );
}
