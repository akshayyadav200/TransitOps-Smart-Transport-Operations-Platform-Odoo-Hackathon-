import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Play, RefreshCw, Wrench, XCircle } from "lucide-react";
import { EmptyState, ErrorState, FormError, LoadingSkeleton, PageHeader, StatusBadge } from "../../components/shared.jsx";
import { vehicleApi } from "../fleet/fleetApi.js";
import { formatIndianCurrency, safeValue } from "../../lib/formatters.js";
import {
  cancelTrip,
  closeMaintenance,
  completeTrip,
  createMaintenance,
  createTrip,
  dispatchTrip,
  fetchDispatchOptions,
  fetchMaintenanceRecords,
  fetchTrips
} from "./operationsApi.js";

const initialTripForm = {
  tripNumber: "",
  source: "",
  destination: "",
  vehicle: "",
  driver: "",
  cargoWeight: "",
  distance: "",
  revenue: "",
  fuel: ""
};

const initialMaintenanceForm = {
  vehicle: "",
  title: "",
  description: "",
  cost: ""
};

function getId(record) {
  return record?.id ?? record?._id;
}

function toNumber(value) {
  return value === "" || value == null ? 0 : Number(value);
}

function getApiErrorMessage(error) {
  return error?.message ?? "Request failed";
}

export function OperationsWorkspace({ mode }) {
  const [trips, setTrips] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [tripForm, setTripForm] = useState(initialTripForm);
  const [maintenanceForm, setMaintenanceForm] = useState(initialMaintenanceForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const pageTitle = mode === "maintenance" ? "Maintenance" : "Dispatch";
  const pageSummary =
    mode === "maintenance"
      ? "Open service jobs, move vehicles into the shop, and safely release them back to available status."
      : "Create trips, dispatch eligible assets, complete work, and preserve automatic status history.";

  const activeMaintenance = useMemo(
    () => maintenanceRecords.filter((record) => record.status === "Active"),
    [maintenanceRecords]
  );

  async function loadData() {
    setError(null);
    setLoading(true);

    try {
      if (mode === "maintenance") {
        const [vehiclePayload, nextMaintenance] = await Promise.all([
          vehicleApi.available({ limit: 100 }),
          fetchMaintenanceRecords()
        ]);
        setTrips([]);
        setVehicles(vehiclePayload.data.items ?? []);
        setDrivers([]);
        setMaintenanceRecords(nextMaintenance);
      } else {
        const [nextTrips, options] = await Promise.all([
          fetchTrips(),
          fetchDispatchOptions()
        ]);
        setTrips(nextTrips);
        setVehicles(options.vehicles ?? []);
        setDrivers(options.drivers ?? []);
        setMaintenanceRecords([]);
      }
    } catch (loadError) {
      setError(loadError);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [mode]);

  function updateTripField(field, value) {
    setTripForm((current) => ({ ...current, [field]: value }));
  }

  function updateMaintenanceField(field, value) {
    setMaintenanceForm((current) => ({ ...current, [field]: value }));
  }

  async function handleTripSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createTrip({
        ...tripForm,
        cargoWeight: toNumber(tripForm.cargoWeight),
        distance: toNumber(tripForm.distance),
        revenue: toNumber(tripForm.revenue),
        fuel: toNumber(tripForm.fuel)
      });
      setTripForm(initialTripForm);
      await loadData();
    } catch (submitError) {
      setError(submitError);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMaintenanceSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createMaintenance({
        ...maintenanceForm,
        cost: toNumber(maintenanceForm.cost)
      });
      setMaintenanceForm(initialMaintenanceForm);
      await loadData();
    } catch (submitError) {
      setError(submitError);
    } finally {
      setSubmitting(false);
    }
  }

  async function runAction(action) {
    setError(null);
    setSubmitting(true);

    try {
      await action();
      await loadData();
    } catch (actionError) {
      setError(actionError);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="operations-workspace">
        <PageHeader eyebrow="Operations" title={pageTitle} description={pageSummary} />
        <LoadingSkeleton rows={6} />
      </section>
    );
  }

  if (error && trips.length === 0 && maintenanceRecords.length === 0) {
    return <ErrorState message={getApiErrorMessage(error)} onRetry={loadData} title="Operations data unavailable" />;
  }

  return (
    <section className="operations-workspace">
      <PageHeader
        eyebrow="Operations automation"
        title={pageTitle}
        description={pageSummary}
        actions={
          <button className="toolbar-button" disabled={submitting} onClick={loadData} type="button">
            <RefreshCw size={16} aria-hidden="true" />
            <span>Refresh</span>
          </button>
        }
      />

      <FormError message={error ? getApiErrorMessage(error) : null} errors={error?.errors} />

      {mode === "maintenance" ? (
        <MaintenancePanel
          activeMaintenance={activeMaintenance}
          form={maintenanceForm}
          onChange={updateMaintenanceField}
          onClose={(id) => runAction(() => closeMaintenance(id))}
          onSubmit={handleMaintenanceSubmit}
          submitting={submitting}
          vehicles={vehicles}
        />
      ) : (
        <TripsPanel
          drivers={drivers}
          form={tripForm}
          onCancel={(id) => runAction(() => cancelTrip(id))}
          onChange={updateTripField}
          onComplete={(id) => runAction(() => completeTrip(id))}
          onDispatch={(id) => runAction(() => dispatchTrip(id))}
          onSubmit={handleTripSubmit}
          submitting={submitting}
          trips={trips}
          vehicles={vehicles}
        />
      )}
    </section>
  );
}

function TripsPanel({ drivers, form, onCancel, onChange, onComplete, onDispatch, onSubmit, submitting, trips, vehicles }) {
  return (
    <div className="operations-grid">
      <form className="ops-panel" onSubmit={onSubmit}>
        <h2>Create Trip</h2>
        <div className="ops-form-grid">
          <label>
            Trip Number
            <input required value={form.tripNumber} onChange={(event) => onChange("tripNumber", event.target.value)} />
          </label>
          <label>
            Vehicle
            <select required value={form.vehicle} onChange={(event) => onChange("vehicle", event.target.value)}>
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={getId(vehicle)} value={getId(vehicle)}>
                  {vehicle.registrationNumber} - {vehicle.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Driver
            <select required value={form.driver} onChange={(event) => onChange("driver", event.target.value)}>
              <option value="">Select driver</option>
              {drivers.map((driver) => (
                <option key={getId(driver)} value={getId(driver)}>
                  {driver.name} - {driver.licenseNumber}
                </option>
              ))}
            </select>
          </label>
          <label>
            Source
            <input required value={form.source} onChange={(event) => onChange("source", event.target.value)} />
          </label>
          <label>
            Destination
            <input required value={form.destination} onChange={(event) => onChange("destination", event.target.value)} />
          </label>
          <label>
            Cargo Weight
            <input min="0" required type="number" value={form.cargoWeight} onChange={(event) => onChange("cargoWeight", event.target.value)} />
          </label>
          <label>
            Distance
            <input min="0" type="number" value={form.distance} onChange={(event) => onChange("distance", event.target.value)} />
          </label>
          <label>
            Fuel
            <input min="0" type="number" value={form.fuel} onChange={(event) => onChange("fuel", event.target.value)} />
          </label>
          <label>
            Revenue
            <input min="0" type="number" value={form.revenue} onChange={(event) => onChange("revenue", event.target.value)} />
          </label>
        </div>
        <button disabled={submitting || vehicles.length === 0 || drivers.length === 0} type="submit">
          Create Trip
        </button>
      </form>

      <TripTable onCancel={onCancel} onComplete={onComplete} onDispatch={onDispatch} submitting={submitting} trips={trips} />
    </div>
  );
}

function TripTable({ onCancel, onComplete, onDispatch, submitting, trips }) {
  if (trips.length === 0) {
    return <EmptyState title="No trips yet" message="Seed demo assets, then create the first dispatch trip." />;
  }

  return (
    <section className="ops-panel">
      <h2>Trip History</h2>
      <div className="ops-table-wrap">
        <table className="ops-table">
          <thead>
            <tr>
              <th>Trip</th>
              <th>Route</th>
              <th>Assets</th>
              <th>Revenue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={getId(trip)}>
                <td>{trip.tripNumber}</td>
                <td>
                  {trip.source} to {trip.destination}
                </td>
                <td>
                  {safeValue(trip.vehicle?.registrationNumber)} / {safeValue(trip.driver?.name)}
                </td>
                <td>{formatIndianCurrency(trip.revenue)}</td>
                <td>
                  <StatusBadge value={trip.status} />
                </td>
                <td>
                  <div className="ops-actions">
                    {trip.status === "Draft" ? (
                      <button disabled={submitting} onClick={() => onDispatch(getId(trip))} title="Dispatch" type="button">
                        <Play size={15} aria-hidden="true" />
                      </button>
                    ) : null}
                    {trip.status === "Dispatched" ? (
                      <button disabled={submitting} onClick={() => onComplete(getId(trip))} title="Complete" type="button">
                        <CheckCircle2 size={15} aria-hidden="true" />
                      </button>
                    ) : null}
                    {["Draft", "Dispatched"].includes(trip.status) ? (
                      <button disabled={submitting} onClick={() => onCancel(getId(trip))} title="Cancel" type="button">
                        <XCircle size={15} aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MaintenancePanel({ activeMaintenance, form, onChange, onClose, onSubmit, submitting, vehicles }) {
  return (
    <div className="operations-grid">
      <form className="ops-panel" onSubmit={onSubmit}>
        <h2>Open Maintenance</h2>
        <div className="ops-form-grid">
          <label>
            Vehicle
            <select required value={form.vehicle} onChange={(event) => onChange("vehicle", event.target.value)}>
              <option value="">Select vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={getId(vehicle)} value={getId(vehicle)}>
                  {vehicle.registrationNumber} - {vehicle.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input required value={form.title} onChange={(event) => onChange("title", event.target.value)} />
          </label>
          <label className="wide-field">
            Description
            <textarea required value={form.description} onChange={(event) => onChange("description", event.target.value)} />
          </label>
          <label>
            Cost
            <input min="0" type="number" value={form.cost} onChange={(event) => onChange("cost", event.target.value)} />
          </label>
        </div>
        <button disabled={submitting || vehicles.length === 0} type="submit">
          Open Maintenance
        </button>
      </form>

      <section className="ops-panel">
        <h2>Maintenance History</h2>
        {activeMaintenance.length === 0 ? (
          <EmptyState title="No active maintenance" message="Open a maintenance job to move a vehicle into the shop." />
        ) : (
          <div className="ops-list">
            {activeMaintenance.map((record) => (
              <article className="ops-list-item" key={getId(record)}>
                <Wrench size={18} aria-hidden="true" />
                <div>
                  <strong>{record.title}</strong>
                  <span>
                    {safeValue(record.vehicle?.registrationNumber)} - {record.description}
                  </span>
                </div>
                <StatusBadge value={record.status} />
                <button disabled={submitting} onClick={() => onClose(getId(record))} type="button">
                  Close
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
      <p className="ops-note">
        <AlertTriangle size={16} aria-hidden="true" />
        Retired vehicles are never returned to Available by maintenance closure.
      </p>
    </div>
  );
}
