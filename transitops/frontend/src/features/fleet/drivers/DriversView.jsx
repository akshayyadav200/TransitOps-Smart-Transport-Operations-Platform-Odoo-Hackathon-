import { useCallback, useState } from "react";
import { Pagination } from "../../../components/common/Pagination.jsx";
import { fieldErrors } from "../formatters.js";
import { driverApi } from "../fleetApi.js";
import { useFleetResource } from "../useFleetResource.js";
import { DriverFilters } from "./DriverFilters.jsx";
import { DriverForm, newDriver } from "./DriverForm.jsx";
import { DriverTable } from "./DriverTable.jsx";

export function DriversView() {
  const fetchDrivers = useCallback((params) => driverApi.list(params), []);
  const resource = useFleetResource(fetchDrivers);
  const [draft, setDraft] = useState(newDriver());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  async function submitDriver(event) {
    event.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      if (editingId) {
        await driverApi.update(editingId, draft);
      } else {
        await driverApi.create(draft);
      }
      setDraft(newDriver());
      setEditingId(null);
      await resource.load();
    } catch (error) {
      setErrors(fieldErrors(error));
    } finally {
      setSaving(false);
    }
  }

  async function remove(driver) {
    await driverApi.remove(driver._id);
    await resource.load();
  }

  return (
    <section className="module-grid">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Driver Management</p>
            <h2>Driver Registry</h2>
          </div>
          {resource.error && <span className="error-pill">{resource.error}</span>}
        </div>
        <DriverFilters filters={resource.filters} onFilter={resource.updateFilter} />
        <DriverTable
          items={resource.items}
          loading={resource.loading}
          onEdit={(driver) => {
            setDraft(driver);
            setEditingId(driver._id);
          }}
          onRemove={remove}
          onSort={resource.setSort}
        />
        <Pagination pagination={resource.pagination} onPageChange={resource.setPage} />
      </div>
      <div className="panel side-panel">
        <p className="eyebrow">{editingId ? "Edit Driver" : "Add Driver"}</p>
        <DriverForm
          draft={draft}
          errors={errors}
          saving={saving}
          onCancel={() => {
            setDraft(newDriver());
            setEditingId(null);
            setErrors({});
          }}
          onChange={setDraft}
          onSubmit={submitDriver}
        />
      </div>
    </section>
  );
}

