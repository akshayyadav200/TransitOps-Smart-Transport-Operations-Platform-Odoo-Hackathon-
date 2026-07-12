import { DRIVER_STATUSES, LICENSE_CATEGORIES } from "../constants.js";

const EMPTY_DRIVER = {
  name: "",
  licenseNumber: "",
  licenseCategory: "Heavy",
  licenseExpiryDate: "",
  contactNumber: "",
  safetyScore: 100,
  region: "",
  status: "Available"
};

export function DriverForm({ draft, errors, onCancel, onChange, onSubmit, saving }) {
  function update(field, value) {
    onChange({ ...draft, [field]: value });
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label>
        Name
        <input value={draft.name} onChange={(event) => update("name", event.target.value)} />
        {errors.name && <small>{errors.name}</small>}
      </label>
      <label>
        License Number
        <input value={draft.licenseNumber} onChange={(event) => update("licenseNumber", event.target.value)} />
        {errors.licenseNumber && <small>{errors.licenseNumber}</small>}
      </label>
      <label>
        Category
        <select value={draft.licenseCategory} onChange={(event) => update("licenseCategory", event.target.value)}>
          {LICENSE_CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </label>
      <label>
        License Expiry
        <input type="date" value={dateInputValue(draft.licenseExpiryDate)} onChange={(event) => update("licenseExpiryDate", event.target.value)} />
        {errors.licenseExpiryDate && <small>{errors.licenseExpiryDate}</small>}
      </label>
      <label>
        Contact Number
        <input value={draft.contactNumber} onChange={(event) => update("contactNumber", event.target.value)} />
        {errors.contactNumber && <small>{errors.contactNumber}</small>}
      </label>
      <label>
        Safety Score
        <input
          max="100"
          min="0"
          type="number"
          value={draft.safetyScore}
          onChange={(event) => update("safetyScore", event.target.value)}
        />
        {errors.safetyScore && <small>{errors.safetyScore}</small>}
      </label>
      <label>
        Region
        <input value={draft.region ?? ""} onChange={(event) => update("region", event.target.value)} />
      </label>
      <label>
        Status
        <select value={draft.status} onChange={(event) => update("status", event.target.value)}>
          {DRIVER_STATUSES.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </label>
      <div className="form-actions">
        <button className="button primary" disabled={saving} type="submit">
          {saving ? "Saving..." : "Save Driver"}
        </button>
        <button className="button secondary" onClick={onCancel} type="button">
          Clear
        </button>
      </div>
    </form>
  );
}

export function newDriver() {
  return { ...EMPTY_DRIVER };
}

function dateInputValue(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

