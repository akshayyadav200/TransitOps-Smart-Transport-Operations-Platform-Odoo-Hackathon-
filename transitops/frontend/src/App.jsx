import {
  Activity,
  BarChart3,
  ClipboardCheck,
  Fuel,
  LayoutDashboard,
  LogOut,
  Route,
  ShieldCheck,
  Truck,
  Wrench
} from "lucide-react";
import React from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { API_BASE_URL } from "./lib/apiClient.js";
import { MODULE_PERMISSIONS, canAccessModule } from "./lib/permissions.js";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { NavigationProvider, useNavigation } from "./routing/NavigationContext.jsx";

const navigationItems = [
  { path: "/dashboard", label: "Dashboard", module: "dashboard", icon: LayoutDashboard },
  { path: "/vehicles", label: "Fleet", module: "vehicles", icon: Truck },
  { path: "/trips", label: "Dispatch", module: "trips", icon: Route },
  { path: "/drivers", label: "Safety", module: "driverCompliance", icon: ShieldCheck },
  { path: "/maintenance", label: "Maintenance", module: "maintenance", icon: Wrench },
  { path: "/reports", label: "Reports", module: "reports", icon: ClipboardCheck },
  { path: "/analytics", label: "Analytics", module: "analytics", icon: BarChart3 },
  { path: "/fuel", label: "Fuel", module: "fuel", icon: Fuel }
];

const routeModules = {
  "/": "dashboard",
  "/dashboard": "dashboard",
  "/vehicles": "vehicles",
  "/trips": "trips",
  "/drivers": "driverCompliance",
  "/maintenance": "maintenance",
  "/reports": "reports",
  "/analytics": "analytics",
  "/fuel": "fuel"
};

function ModuleView({ moduleName }) {
  const { user } = useAuth();
  const title = navigationItems.find((item) => item.module === moduleName)?.label ?? "Dashboard";

  return (
    <section className="module-view">
      <div>
        <p className="eyebrow">Secure workspace</p>
        <h1>{title}</h1>
        <p className="summary">
          {user.role} access is active. Backend routes must still use `authenticate` and `authorizeRoles` for this module.
        </p>
      </div>
      <div className="status-grid" aria-label="Authentication status">
        <article className="status-card">
          <Activity size={22} aria-hidden="true" />
          <span>API</span>
          <strong>{API_BASE_URL}</strong>
        </article>
        <article className="status-card">
          <ShieldCheck size={22} aria-hidden="true" />
          <span>Role</span>
          <strong>{user.role}</strong>
        </article>
        <article className="status-card">
          <ClipboardCheck size={22} aria-hidden="true" />
          <span>Session</span>
          <strong>HttpOnly cookie</strong>
        </article>
      </div>
    </section>
  );
}

function Sidebar() {
  const { user, logout } = useAuth();
  const { path, navigate } = useNavigation();
  const visibleItems = navigationItems.filter((item) => canAccessModule(user.role, item.module));

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <div>
        <p className="brand">TransitOps</p>
        <p className="role-chip">{user.role}</p>
      </div>
      <nav aria-label="Primary">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = path === item.path || (path === "/" && item.path === "/dashboard");

          return (
            <button className={active ? "nav-link active" : "nav-link"} key={item.path} onClick={() => navigate(item.path)} type="button">
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button className="logout-button" onClick={handleLogout} type="button">
        <LogOut size={18} aria-hidden="true" />
        <span>Logout</span>
      </button>
    </aside>
  );
}

function AppShell({ children }) {
  return (
    <main className="app-shell">
      <Sidebar />
      <section className="content-shell">{children}</section>
    </main>
  );
}

function RoutedApp() {
  const { path } = useNavigation();

  if (path === "/login") {
    return <LoginPage />;
  }

  const moduleName = routeModules[path];

  if (!moduleName) {
    return (
      <ProtectedRoute>
        <AppShell>
          <NotFoundPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={MODULE_PERMISSIONS[moduleName]}>
      <AppShell>
        <ModuleView moduleName={moduleName} />
      </AppShell>
    </ProtectedRoute>
  );
}

export function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <RoutedApp />
      </AuthProvider>
    </NavigationProvider>
  );
}
