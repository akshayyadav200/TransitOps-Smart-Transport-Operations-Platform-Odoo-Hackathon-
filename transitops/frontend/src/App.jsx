import { Activity, ShieldCheck, Route, Users } from "lucide-react";
import { API_BASE_URL } from "./lib/apiClient.js";

const foundationItems = [
  { label: "API", value: "/api", icon: Route },
  { label: "Health", value: "/api/health", icon: Activity },
  { label: "RBAC", value: "5 shared roles", icon: ShieldCheck },
  { label: "Team Fields", value: "documented", icon: Users }
];

export function App() {
  return (
    <main className="shell">
      <section className="workspace">
        <div className="masthead">
          <p className="eyebrow">TransitOps</p>
          <h1>Smart transport operations foundation</h1>
          <p className="summary">
            Backend contracts, shared constants, API client, and team integration notes are ready for the next feature modules.
          </p>
        </div>

        <div className="status-grid" aria-label="Foundation status">
          {foundationItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="status-card" key={item.label}>
                <Icon size={22} aria-hidden="true" />
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            );
          })}
        </div>

        <section className="api-panel" aria-label="API configuration">
          <div>
            <p className="panel-label">API Base URL</p>
            <code>{API_BASE_URL}</code>
          </div>
          <a className="health-link" href={`${API_BASE_URL}/health`}>
            Open health
          </a>
        </section>
      </section>
    </main>
  );
}
