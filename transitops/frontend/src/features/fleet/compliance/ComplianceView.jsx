import { useEffect, useState } from "react";
import { createElement } from "react";
import { ShieldAlert, ShieldCheck, TrendingUp, UserRoundCheck, Users } from "lucide-react";
import { complianceApi } from "../fleetApi.js";

const METRICS = [
  ["totalDrivers", "Total Drivers", Users],
  ["validLicenses", "Valid Licenses", ShieldCheck],
  ["expiredLicenses", "Expired Licenses", ShieldAlert],
  ["licensesExpiringSoon", "Expiring Soon", TrendingUp],
  ["averageSafetyScore", "Avg Safety Score", UserRoundCheck],
  ["suspendedDrivers", "Suspended", ShieldAlert]
];

export function ComplianceView() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    complianceApi
      .drivers()
      .then((response) => setMetrics(response.data))
      .catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Compliance Dashboard</p>
          <h2>Driver Safety & License Health</h2>
        </div>
        {error && <span className="error-pill">{error}</span>}
      </div>
      {!metrics ? (
        <div className="empty-state">Loading compliance metrics...</div>
      ) : (
        <div className="metric-grid">
          {METRICS.map(([key, label, Icon]) => (
            <article className="metric-card" key={key}>
              {createElement(Icon, { size: 22, "aria-hidden": "true" })}
              <span>{label}</span>
              <strong>{metrics[key]}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
