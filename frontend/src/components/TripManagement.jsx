import React, { useState, useEffect } from 'react';

export default function TripManagement() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'create'
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    tripNumber: '',
    source: '',
    destination: '',
    cargoWeight: '',
    distance: '',
    revenue: '',
    fuel: '',
    vehicle: '',
    driver: '',
  });

  // Fetch initial data
  useEffect(() => {
    fetchTrips();
    fetchVehiclesAndDrivers();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/trips');
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      } else {
        // Fallback to empty if api is not fully online yet, to keep it presentation-ready
        setTrips([]);
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      // Fail silently or fallback for presentation purposes
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehiclesAndDrivers = async () => {
    try {
      const [vRes, dRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/drivers')
      ]);
      if (vRes.ok) {
        const vData = await vRes.json();
        setVehicles(vData.filter(v => v.status !== 'Retired' && v.status !== 'In Shop'));
      }
      if (dRes.ok) {
        const dData = await dRes.json();
        setDrivers(dData.filter(d => d.status !== 'Suspended' && d.status !== 'Expired'));
      }
    } catch (err) {
      console.error("Error fetching fleet metadata:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);
    setSuccess(null);

    // Basic frontend validations (backend will also enforce rules strictly)
    if (!formData.tripNumber || !formData.source || !formData.destination || !formData.cargoWeight) {
      setError("Please fill in all required fields (Trip Reference, Origin, Destination, Cargo Payload).");
      setActionLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        cargoWeight: parseFloat(formData.cargoWeight),
        distance: formData.distance ? parseFloat(formData.distance) : 0,
        revenue: formData.revenue ? parseFloat(formData.revenue) : 0,
        fuel: formData.fuel ? parseFloat(formData.fuel) : 0,
        vehicle: formData.vehicle || null,
        driver: formData.driver || null,
      };

      const res = await fetch('/api/trips', {
        custom: true, // for visual tracking
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create trip');
      }

      setSuccess(`Trip ${data.tripNumber} successfully registered!`);
      // Reset form
      setFormData({
        tripNumber: '',
        source: '',
        destination: '',
        cargoWeight: '',
        distance: '',
        revenue: '',
        fuel: '',
        vehicle: '',
        driver: '',
      });
      // Fetch latest trips and switch tab
      await fetchTrips();
      setActiveTab('registry');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDispatch = async (tripId) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/trips/${tripId}/dispatch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Dispatch failed');
      setSuccess(`Trip dispatched successfully!`);
      fetchTrips();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (tripId) => {
    setActionLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/trips/${tripId}/complete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Completion failed');
      setSuccess(`Trip marked as Completed!`);
      fetchTrips();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-stone-800 font-sans p-6 md:p-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-stone-900">TransitOps</h1>
          <p className="text-sm text-stone-500 mt-1 font-mono">Smart Transport Operations & Dispatch Control</p>
        </div>
        
        {/* Toggle Tabs */}
        <div className="flex space-x-1 mt-4 md:mt-0 bg-stone-100 p-1 rounded-lg border border-stone-200/60">
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 text-xs font-medium tracking-wide rounded-md transition-all duration-200 ${
              activeTab === 'registry'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Trip Registry
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-xs font-medium tracking-wide rounded-md transition-all duration-200 ${
              activeTab === 'create'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            + Create New Trip
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-rose-50/80 border border-rose-200/50 rounded-lg text-rose-800 text-sm flex items-center">
            <span className="font-medium mr-2 font-mono">Error:</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-stone-100/90 border border-stone-200/80 rounded-lg text-stone-800 text-sm flex items-center">
            <span className="font-medium mr-2 font-mono">Success:</span> {success}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'registry' ? (
          /* TRIP REGISTRY VIEW */
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden transition-all duration-300">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <div>
                <h2 className="text-base font-medium text-stone-900">Operations Ledger</h2>
                <p className="text-xs text-stone-400 mt-0.5">Historical log of all planned, active, and concluded freights.</p>
              </div>
              <button 
                onClick={fetchTrips} 
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center font-mono"
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Logs ⟳'}
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-stone-400 text-sm font-light">
                Retrieving transport registry data...
              </div>
            ) : trips.length === 0 ? (
              <div className="p-12 text-center text-stone-400 text-sm font-light">
                No trips registered in the database. Select "+ Create New Trip" to register dispatch routes.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50/30 text-stone-500 text-[10px] tracking-widest uppercase border-b border-stone-100 font-mono">
                      <th className="py-4 px-6 font-medium">Trip ID</th>
                      <th className="py-4 px-6 font-medium">Route</th>
                      <th className="py-4 px-6 font-medium text-right">Cargo (kg)</th>
                      <th className="py-4 px-6 font-medium text-right">Distance (km)</th>
                      <th className="py-4 px-6 font-medium text-right">Revenue</th>
                      <th className="py-4 px-6 font-medium">Fleet Assignment</th>
                      <th className="py-4 px-6 font-medium text-center">Status</th>
                      <th className="py-4 px-6 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs">
                    {trips.map((trip) => (
                      <tr key={trip._id} className="hover:bg-stone-50/50 transition-colors duration-150">
                        <td className="py-4 px-6 font-mono font-medium text-stone-900">{trip.tripNumber}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-stone-800 font-medium">{trip.source}</span>
                            <span className="text-[10px] text-stone-400 mt-0.5">to {trip.destination}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-stone-700">{trip.cargoWeight.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right font-mono text-stone-600">
                          {trip.distance} km <span className="text-[10px] text-stone-400">({trip.fuel}L fuel)</span>
                        </td>
                        <td className="py-4 px-6 text-right font-mono text-emerald-800 font-medium">${trip.revenue.toLocaleString()}</td>
                        <td className="py-4 px-6">
                          {trip.vehicle || trip.driver ? (
                            <div className="flex flex-col gap-0.5">
                              {trip.vehicle && (
                                <span className="text-[10px] text-stone-600 font-mono">
                                  🚙 {trip.vehicle.plateNumber || 'Assigned ID: ' + trip.vehicle.toString().substring(0,8)}
                                </span>
                              )}
                              {trip.driver && (
                                <span className="text-[10px] text-stone-600 font-mono">
                                  👤 {trip.driver.name || 'Assigned ID: ' + trip.driver.toString().substring(0,8)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-stone-400 italic text-[11px]">Unassigned</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`inline-block px-2.5 py-0.5 text-[10px] font-medium tracking-wide rounded-full border ${
                            trip.status === 'Draft' ? 'bg-stone-50 text-stone-600 border-stone-200' :
                            trip.status === 'Dispatched' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            trip.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-rose-50 text-rose-700 border-rose-200'
                          }`}>
                            {trip.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          {trip.status === 'Draft' && (
                            <button
                              onClick={() => handleDispatch(trip._id)}
                              disabled={actionLoading}
                              className="text-[10px] font-mono border border-stone-300 px-2 py-1 rounded bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                            >
                              Dispatch
                            </button>
                          )}
                          {trip.status === 'Dispatched' && (
                            <button
                              onClick={() => handleComplete(trip._id)}
                              disabled={actionLoading}
                              className="text-[10px] font-mono border border-emerald-300 px-2 py-1 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* CREATE NEW TRIP VIEW */
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden transition-all duration-300">
            <div className="p-6 border-b border-stone-100 bg-stone-50/50">
              <h2 className="text-base font-medium text-stone-900">Deployment Setup Form</h2>
              <p className="text-xs text-stone-400 mt-0.5">Register a transport itinerary and allocate vehicle assets.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Trip Reference ID */}
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-600 uppercase mb-1">
                    Trip Reference Identifier *
                  </label>
                  <input
                    type="text"
                    name="tripNumber"
                    required
                    value={formData.tripNumber}
                    onChange={handleInputChange}
                    placeholder="TRIP-2026-X"
                    className="w-full px-3 py-2 text-sm bg-[#fafafa] border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-mono transition-all"
                  />
                </div>

                {/* Cargo Payload Mass */}
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-600 uppercase mb-1">
                    Cargo Payload Mass (kg) *
                  </label>
                  <input
                    type="number"
                    name="cargoWeight"
                    required
                    value={formData.cargoWeight}
                    onChange={handleInputChange}
                    placeholder="e.g. 5000"
                    className="w-full px-3 py-2 text-sm bg-[#fafafa] border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-mono transition-all"
                  />
                </div>

                {/* Source Origin */}
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-600 uppercase mb-1">
                    Source Origin Terminal *
                  </label>
                  <input
                    type="text"
                    name="source"
                    required
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="e.g. Terminal A (San Francisco)"
                    className="w-full px-3 py-2 text-sm bg-[#fafafa] border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all"
                  />
                </div>

                {/* Destination Terminal */}
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-600 uppercase mb-1">
                    Destination Terminal *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleInputChange}
                    placeholder="e.g. Terminal B (Los Angeles)"
                    className="w-full px-3 py-2 text-sm bg-[#fafafa] border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all"
                  />
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-600 uppercase mb-1">
                    Planned Distance (km)
                  </label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    placeholder="e.g. 620"
                    className="w-full px-3 py-2 text-sm bg-[#fafafa] border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-mono transition-all"
                  />
                </div>

                {/* Fuel */}
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-600 uppercase mb-1">
                    Fuel Allocated (Liters)
                  </label>
                  <input
                    type="number"
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    placeholder="e.g. 150"
                    className="w-full px-3 py-2 text-sm bg-[#fafafa] border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-mono transition-all"
                  />
                </div>

                {/* Expected Revenue */}
                <div>
                  <label className="block text-xs font-mono font-medium text-stone-600 uppercase mb-1">
                    Expected Revenue ($)
                  </label>
                  <input
                    type="number"
                    name="revenue"
                    value={formData.revenue}
                    onChange={handleInputChange}
                    placeholder="e.g. 1200"
                    className="w-full px-3 py-2 text-sm bg-[#fafafa] border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-mono transition-all"
                  />
                </div>

                {/* Combined Vehicle and Driver Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-medium text-stone-600 uppercase mb-1">
                      Vehicle Asset
                    </label>
                    <select
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-[#fafafa] border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-mono transition-all"
                    >
                      <option value="">-- Assign Vehicle --</option>
                      {vehicles.map(v => (
                        <option key={v._id} value={v._id}>
                          {v.plateNumber} ({v.maxCapacity}kg capacity)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-medium text-stone-600 uppercase mb-1">
                      Driver Asset
                    </label>
                    <select
                      name="driver"
                      value={formData.driver}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm bg-[#fafafa] border border-stone-200 rounded-md focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 font-mono transition-all"
                    >
                      <option value="">-- Assign Driver --</option>
                      {drivers.map(d => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4 border-t border-stone-100">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-md text-xs font-medium font-mono tracking-wider transition-all duration-200 shadow-sm disabled:opacity-50"
                >
                  {actionLoading ? 'Saving Setup...' : 'Register Route Itinerary'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
