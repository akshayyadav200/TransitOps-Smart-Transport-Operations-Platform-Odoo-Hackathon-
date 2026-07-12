import { useCallback, useState } from "react";
import { Pagination } from "../../../components/common/Pagination.jsx";
import { fieldErrors } from "../formatters.js";
import { vehicleApi } from "../fleetApi.js";
import { useFleetResource } from "../useFleetResource.js";
import { newVehicle, VehicleForm } from "./VehicleForm.jsx";
import { VehicleFilters } from "./VehicleFilters.jsx";
import { VehicleTable } from "./VehicleTable.jsx";

export function VehiclesView() {
  const fetchVehicles = useCallback((params) => vehicleApi.list(params), []);
  const resource = useFleetResource(fetchVehicles);
  const [draft, setDraft] = useState(newVehicle());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  async function submitVehicle(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      if (editingId) {
        await vehicleApi.update(editingId, draft);
      } else {
        await vehicleApi.create(draft);
      }
      setDraft(newVehicle());
      setEditingId(null);
      await resource.load();
    } catch (error) {
      setErrors(fieldErrors(error));
    } finally {
      setSaving(false);
    }
  }

  async function retire(vehicle) {
    await vehicleApi.retire(vehicle._id);
    await resource.load();
  }

  return (
    <section className="module-grid">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Vehicle Management</p>
            <h2>Fleet Registry</h2>
          </div>
          {resource.error && <span className="error-pill">{resource.error}</span>}
        </div>
        <VehicleFilters filters={resource.filters} onFilter={resource.updateFilter} />
        <VehicleTable
          items={resource.items}
          loading={resource.loading}
          onEdit={(vehicle) => {
            setDraft(vehicle);
            setEditingId(vehicle._id);
          }}
          onRetire={retire}
          onSort={resource.setSort}
        />
        <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
      </div>
      <div className="panel side-panel">
        <p className="eyebrow">{editingId ? "Edit Vehicle" : "Add Vehicle"}</p>
        <VehicleForm
          editingVehicle={draft}
          errors={errors}
          saving={saving}
          onCancel={() => {
            setDraft(newVehicle());
            setEditingId(null);
            setErrors({});
          }}
          onChange={setDraft}
          onSubmit={submitVehicle}
        />
      </div>
    </section>
  );
}

