import { VEHICLE_STATUSES, VEHICLE_TYPES } from "../constants.js";

const EMPTY_VEHICLE = {
  registrationNumber: "",
  name: "",
  model: "",
  type: "Truck",
  maximumLoadCapacity: "",
  odometer: 0,
  acquisitionCost: 0,
  region: "",
  status: "Available"
};

export function VehicleForm({ editingVehicle, errors, onCancel, onChange, onSubmit, saving }) {
  const values = editingVehicle ?? EMPTY_VEHICLE;

  function update(field, value) {
    onChange({ ...values, [field]: value });
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>
        Registration
        <input value={values.registrationNumber} onChange={(event) => update("registrationNumber", event.target.value)} />
        {errors.registrationNumber && <small>{errors.registrationNumber}</small>}
      </label>
      <label>
        Name
        <input value={values.name} onChange={(event) => update("name", event.target.value)} />
        {errors.name && <small>{errors.name}</small>}
      </label>
      <label>
        Model
        <input value={values.model ?? ""} onChange={(event) => update("model", event.target.value)} />
      </label>
      <label>
        Type
        <select value={values.type} onChange={(event) => update("type", event.target.value)}>
          {VEHICLE_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <label>
        Capacity
        <input
          min="0"
          step="0.01"
          type="number"
          value={values.maximumLoadCapacity}
          onChange={(event) => update("maximumLoadCapacity", event.target.value)}
        />
        {errors.maximumLoadCapacity && <small>{errors.maximumLoadCapacity}</small>}
      </label>
      <label>
        Odometer
        <input min="0" type="number" value={values.odometer} onChange={(event) => update("odometer", event.target.value)} />
        {errors.odometer && <small>{errors.odometer}</small>}
      </label>
      <label>
        Acquisition Cost
        <input
          min="0"
          type="number"
          value={values.acquisitionCost}
          onChange={(event) => update("acquisitionCost", event.target.value)}
        />
      </label>
      <label>
        Region
        <input value={values.region ?? ""} onChange={(event) => update("region", event.target.value)} />
      </label>
      <label>
        Status
        <select value={values.status} onChange={(event) => update("status", event.target.value)}>
          {VEHICLE_STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </label>
      <div className="form-actions">
        <button className="button primary" disabled={saving} type="submit">
          {saving ? "Saving..." : "Save Vehicle"}
        </button>
        <button className="button secondary" onClick={onCancel} type="button">
          Clear
        </button>
      </div>
    </form>
  );
}

export function newVehicle() {
  return { ...EMPTY_VEHICLE };
}

