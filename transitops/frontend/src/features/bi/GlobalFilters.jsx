import { useEffect, useState } from "react";
import { FiFilter, FiRefreshCw } from "react-icons/fi";
import { EXPENSE_CATEGORIES, FUEL_TYPES, TRIP_STATUSES, VEHICLE_STATUSES } from "./constants.js";
import { reportApi } from "./biApi.js";
import { useGlobalFilters } from "./FiltersContext.jsx";
import { tripLabel, vehicleLabel } from "./formatters.js";

export function GlobalFilters() {
  const { filters, updateFilter, resetFilters } = useGlobalFilters();
  const [options, setOptions] = useState({ regions: [], vehicles: [], trips: [], drivers: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    reportApi
      .filters()
      .then((response) => {
        if (mounted) {
          setOptions(response.data);
        }
      })
      .catch(() => {
        if (mounted) {
          setOptions({ regions: [], vehicles: [], trips: [], drivers: [] });
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="global-filters" aria-label="Global business intelligence filters">
      <div className="filter-title">
        <FiFilter aria-hidden="true" />
        <span>Filters</span>
      </div>
      <select value={filters.vehicleId} onChange={(event) => updateFilter("vehicleId", event.target.value)}>
        <option value="">All vehicles</option>
        {options.vehicles.map((vehicle) => (
          <option key={vehicle._id} value={vehicle._id}>
            {vehicleLabel(vehicle)}
          </option>
        ))}
      </select>
      <select value={filters.tripId} onChange={(event) => updateFilter("tripId", event.target.value)}>
        <option value="">All trips</option>
        {options.trips.map((trip) => (
          <option key={trip._id} value={trip._id}>
            {tripLabel(trip)}
          </option>
        ))}
      </select>
      <select value={filters.driverId} onChange={(event) => updateFilter("driverId", event.target.value)}>
        <option value="">All drivers</option>
        {options.drivers.map((driver) => (
          <option key={driver._id} value={driver._id}>
            {driver.name}
          </option>
        ))}
      </select>
      <select value={filters.region} onChange={(event) => updateFilter("region", event.target.value)}>
        <option value="">All regions</option>
        {options.regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
      <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
        <option value="">All statuses</option>
        {[...VEHICLE_STATUSES, ...TRIP_STATUSES].map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <input
        aria-label="Start date"
        type="date"
        value={filters.startDate}
        onChange={(event) => updateFilter("startDate", event.target.value)}
      />
      <input
        aria-label="End date"
        type="date"
        value={filters.endDate}
        onChange={(event) => updateFilter("endDate", event.target.value)}
      />
      <select value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
        <option value="">All expense categories</option>
        {EXPENSE_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select value={filters.fuelType} onChange={(event) => updateFilter("fuelType", event.target.value)}>
        <option value="">All fuel types</option>
        {FUEL_TYPES.map((fuelType) => (
          <option key={fuelType} value={fuelType}>
            {fuelType}
          </option>
        ))}
      </select>
      <button className="icon-button" disabled={loading} onClick={resetFilters} title="Reset filters" type="button">
        <FiRefreshCw aria-hidden="true" />
      </button>
    </section>
  );
}
