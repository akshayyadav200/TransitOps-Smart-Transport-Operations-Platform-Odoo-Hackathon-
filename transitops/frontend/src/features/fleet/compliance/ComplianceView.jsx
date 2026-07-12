import React, { useEffect, useState } from "react";
import { createElement } from "react";
import { ShieldAlert, ShieldCheck, TrendingUp, UserRoundCheck, Users, AlertTriangle } from "lucide-react";
import { complianceApi } from "../fleetApi.js";

const METRICS_CONFIG = {
  totalDrivers: { label: "Total Drivers", Icon: Users, colorClass: "emerald" },
  validLicenses: { label: "Valid Licenses", Icon: ShieldCheck, colorClass: "blue", showProgress: true },
  expiredLicenses: { label: "Expired Licenses", Icon: AlertTriangle, colorClass: "danger", alertOnValue: true },
  licensesExpiringSoon: { label: "Expiring Soon", Icon: TrendingUp, colorClass: "warning" },
  averageSafetyScore: { label: "Avg Safety Score", Icon: UserRoundCheck, colorClass: "emerald", showProgress: true, maxVal: 100 },
  suspendedDrivers: { label: "Suspended", Icon: ShieldAlert, colorClass: "danger", alertOnValue: true }
};

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
          <p className="eyebrow">Operations & Compliance</p>
          <h2>Driver Safety & License Health</h2>
        </div>
        {error && <span className="error-pill">{error}</span>}
      </div>
      
      {!metrics ? (
        <div className="empty-state">Loading compliance metrics...</div>
      ) : (
        <div style={{ display: "grid", gap: "24px" }}>
          <div className="metric-grid">
            {Object.entries(METRICS_CONFIG).map(([key, config]) => {
              const value = metrics[key] ?? 0;
              const hasAlert = config.alertOnValue && value > 0;
              
              // Calculate progress percentage if needed
              let progressPct = null;
              if (config.showProgress) {
                if (key === "validLicenses" && metrics.totalDrivers > 0) {
                  progressPct = Math.min((value / metrics.totalDrivers) * 100, 100);
                } else if (key === "averageSafetyScore") {
                  progressPct = value;
                }
              }

              return (
                <article 
                  className={`metric-card ${hasAlert ? "metric-card-alert" : ""}`} 
                  key={key}
                  style={hasAlert ? { borderLeft: "4px solid var(--danger)", background: "rgba(239, 68, 68, 0.05)" } : {}}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    {createElement(config.Icon, { size: 24, "aria-hidden": "true" })}
                    {hasAlert && (
                      <span className="badge badge-danger" style={{ animation: "pulse 2s infinite" }}>
                        Action Required
                      </span>
                    )}
                  </div>
                  <span>{config.label}</span>
                  <strong>{value}</strong>

                  {progressPct !== null && (
                    <div style={{ marginTop: "12px", width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px" }}>
                        <span>Status Score</span>
                        <span>{progressPct.toFixed(0)}%</span>
                      </div>
                      <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                        <div 
                          style={{ 
                            height: "100%", 
                            width: `${progressPct}%`, 
                            background: config.colorClass === "emerald" ? "var(--accent-primary)" : "var(--accent-secondary)",
                            borderRadius: "2px",
                            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                          }} 
                        />
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div style={{ 
            marginTop: "16px",
            padding: "20px", 
            background: "rgba(255, 255, 255, 0.02)", 
            borderRadius: "var(--radius-md)", 
            border: "1px solid var(--border-color)",
            display: "grid",
            gap: "12px"
          }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontFamily: "var(--font-heading)" }}>Operations Compliance Summary</h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
              Our platform ensures all dispatched resources adhere to transportation laws. Expired-license drivers and suspended operators are automatically blacklisted from the dispatch list. Review active items requiring compliance renewals above.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
