/**
 * Odoo ERP Integration Adapter (Mock Framework)
 * Demonstrates the structural mapping and XML-RPC / JSON-RPC interface payload layouts
 * for syncing validated dispatch trips with Odoo ERP modules (e.g., Fleet and Account modules).
 */

class OdooAdapter {
  constructor() {
    this.odooUrl = process.env.ODOO_URL || 'https://mock-odoo.transitops.org';
    this.db = process.env.ODOO_DB || 'transitops_production';
    this.username = process.env.ODOO_USER || 'erp_sync_agent';
  }

  /**
   * Transforms and synchronizes a validated Trip document into Odoo ERP
   * Map Trip Schema fields to Odoo's fleet.vehicle.log.services and custom transitops.trip models.
   */
  async syncTripToOdoo(tripData) {
    console.log(`[Odoo ERP Adapter] Initiating synchronization for Trip: ${tripData.tripNumber}`);

    // Map MERN models to Odoo record structure
    const odooPayload = {
      model: 'transitops.trip',
      method: 'create',
      args: [{
        name: tripData.tripNumber,
        x_source: tripData.source,
        x_destination: tripData.destination,
        x_cargo_weight: tripData.cargoWeight,
        x_distance: tripData.distance,
        x_fuel_allocated: tripData.fuel,
        x_expected_revenue: tripData.revenue,
        // Map references
        vehicle_id: tripData.vehicle ? tripData.vehicle.toString() : null,
        driver_id: tripData.driver ? tripData.driver.toString() : null,
        state: this._mapStatusToOdooState(tripData.status),
        x_sync_timestamp: new Date().toISOString()
      }],
      kwargs: {
        context: { lang: 'en_US' }
      }
    };

    // Simulate XML-RPC/JSON-RPC networking delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Generate mock enterprise receipt IDs
    const mockOdooRecordId = Math.floor(Math.random() * 100000) + 12000;
    const syncReceipt = {
      success: true,
      odoo_record_id: mockOdooRecordId,
      odoo_external_ref: `odoo-ref-${tripData.tripNumber.toLowerCase()}-${mockOdooRecordId}`,
      synced_at: new Date().toISOString(),
      payload_sent: odooPayload
    };

    console.log(`[Odoo ERP Adapter] Synchronization complete. Odoo Record ID: ${mockOdooRecordId}`);
    return syncReceipt;
  }

  /**
   * Maps MongoDB trip status to Odoo workflow states
   */
  _mapStatusToOdooState(status) {
    switch (status) {
      case 'Draft': return 'draft';
      case 'Pending Dispatch': return 'confirmed';
      case 'Dispatched': return 'progress';
      case 'Completed': return 'done';
      case 'Cancelled': return 'cancel';
      default: return 'draft';
    }
  }

  /**
   * Synchronizes vehicle maintenance status and state transitions directly to Odoo Fleet
   */
  async syncVehicleMaintenance(vehicleId, maintenanceDetails) {
    console.log(`[Odoo ERP Adapter] Syncing Vehicle [${vehicleId}] maintenance status to Odoo 'fleet.vehicle'`);

    const odooPayload = {
      model: 'fleet.vehicle',
      method: 'write',
      args: [
        [vehicleId],
        {
          x_availability_status: 'in_shop',
          x_maintenance_description: maintenanceDetails.description,
          x_last_service_date: new Date().toISOString()
        }
      ]
    };

    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      success: true,
      vehicle_id: vehicleId,
      state: 'in_shop',
      sync_payload: odooPayload
    };
  }
}

module.exports = new OdooAdapter();
