import {
  Activity,
  BarChart3,
  ClipboardCheck,
  Fuel,
  LayoutDashboard,
  LogOut,
  Menu,
  Route,
  ShieldCheck,
  Truck,
  UserCircle,
  Wrench,
  X
} from "lucide-react";
import React, { useState } from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { ToastProvider, useToast } from "./components/ToastProvider.jsx";
import { ConfirmDialog, EmptyState, PageHeader, StatusBadge } from "./components/shared.jsx";
import { FleetWorkspace } from "./features/fleet/FleetWorkspace.jsx";
import { API_BASE_URL } from "./lib/apiClient.js";
import { MODULE_PERMISSIONS, canShowNavigationItem } from "./lib/permissions.js";
import { getDefaultRouteForRole } from "./lib/permissions.js";
import { formatDate, safeValue } from "./lib/formatters.js";
import { LoginPage } from "./pages/LoginPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { OperationsWorkspace } from "./features/operations/OperationsWorkspace.jsx";
import { UnauthorizedPage } from "./pages/UnauthorizedPage.jsx";
import { NavigationProvider, useNavigation } from "./routing/NavigationContext.jsx";

const navigationItems = [
  { path: "/dashboard", label: "Dashboard", module: "dashboard", icon: LayoutDashboard, pageExists: true },
  { path: "/vehicles", label: "Fleet", module: "vehicles", icon: Truck, pageExists: true },
  { path: "/trips", label: "Dispatch", module: "trips", icon: Route, pageExists: true },
  { path: "/drivers", label: "Safety", module: "driverCompliance", icon: ShieldCheck, pageExists: true },
  { path: "/maintenance", label: "Maintenance", module: "maintenance", icon: Wrench, pageExists: true },
  { path: "/reports", label: "Reports", module: "reports", icon: ClipboardCheck, pageExists: true },
  { path: "/analytics", label: "Analytics", module: "analytics", icon: BarChart3, pageExists: true },
  { path: "/expenses", label: "Expenses", module: "expenses", icon: ClipboardCheck, pageExists: true },
  { path: "/fuel", label: "Fuel", module: "fuel", icon: Fuel, pageExists: true }
];

const routeModules = {
  "/dashboard": "dashboard",
  "/vehicles": "vehicles",
  "/trips": "trips",
  "/drivers": "driverCompliance",
  "/maintenance": "maintenance",
  "/reports": "reports",
  "/analytics": "analytics",
  "/expenses": "expenses",
  "/fuel": "fuel"
};

const moduleDescriptions = {
  dashboard: "Operational overview for the modules currently available to your role.",
  vehicles: "Fleet module access is ready for Person 2 integration.",
  trips: "Dispatch module access is ready for Person 3 integration.",
  driverCompliance: "Driver compliance access is ready for Safety Officer workflows.",
  maintenance: "Maintenance access is ready for service tracking integration.",
  reports: "Reports access is ready for shared analytics contracts.",
  analytics: "Analytics access is ready for finance dashboards.",
  expenses: "Expense access is ready for Person 4 integration.",
  fuel: "Fuel and expense access is ready for Person 4 integration."
};

function ModuleView({ moduleName }) {
  const { user } = useAuth();
  const title = navigationItems.find((item) => item.module === moduleName)?.label ?? "Dashboard";

  if (moduleName === "trips" || moduleName === "maintenance") {
    return <OperationsWorkspace mode={moduleName === "maintenance" ? "maintenance" : "trips"} />;
  }

  if (moduleName === "vehicles" || moduleName === "driverCompliance") {
    return <FleetWorkspace initialTab={moduleName === "driverCompliance" ? "drivers" : "vehicles"} />;
  }

  return (
    <section className="module-view">
      <PageHeader
        eyebrow="Secure workspace"
        title={title}
        description={moduleDescriptions[moduleName]}
        actions={<StatusBadge value={user.role} />}
      />

      <div className="status-grid" aria-label="Authentication status">
        <article className="status-card">
          <Activity size={22} aria-hidden="true" />
          <span>API</span>
          <strong>{API_BASE_URL}</strong>
        </article>
        <article className="status-card">
          <ShieldCheck size={22} aria-hidden="true" />
          <span>Security</span>
          <strong>Backend RBAC enforced</strong>
        </article>
        <article className="status-card">
          <ClipboardCheck size={22} aria-hidden="true" />
          <span>Session</span>
          <strong>HttpOnly cookie</strong>
        </article>
      </div>

      <EmptyState
        title={`${title} module awaits team integration`}
        message="No working module page has been added on this branch yet, so this shell exposes access and contracts without pretending CRUD is complete."
      />
    </section>
  );
}

function Sidebar({ isOpen, onNavigate, onRequestLogout }) {
  const { user } = useAuth();
  const { path, navigate } = useNavigation();
  const visibleItems = navigationItems.filter((item) => item.pageExists && canShowNavigationItem(user, item));

  function handleNavigate(nextPath) {
    navigate(nextPath);
    onNavigate();
  }

  return (
    <aside className={isOpen ? "sidebar open" : "sidebar"}>
      <div>
        <p className="brand">TransitOps</p>
        <p className="role-chip">{user.role}</p>
      </div>
      <nav aria-label="Primary">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = path === item.path || (path === "/" && item.path === "/dashboard");

          return (
            <button className={active ? "nav-link active" : "nav-link"} key={item.path} onClick={() => handleNavigate(item.path)} type="button">
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button className="logout-button" onClick={onRequestLogout} type="button">
        <LogOut size={18} aria-hidden="true" />
        <span>Logout</span>
      </button>
    </aside>
  );
}

function Header({ onMenuClick, pageTitle }) {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <button aria-label="Open navigation" className="icon-button menu-button" onClick={onMenuClick} type="button">
        <Menu size={20} aria-hidden="true" />
      </button>
      <div>
        <p className="topbar-label">Workspace</p>
        <strong>{pageTitle}</strong>
      </div>
      <div className="user-pill">
        <UserCircle size={20} aria-hidden="true" />
        <span>{safeValue(user.name)}</span>
        <StatusBadge value={user.role} />
      </div>
    </header>
  );
}

function AppShell({ children, pageTitle }) {
  const { logout, user } = useAuth();
  const { navigate } = useNavigation();
  const { showToast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setConfirmLogoutOpen(false);
    showToast("Signed out successfully", "success");
    navigate("/login", { replace: true });
  }

  return (
    <main className="app-shell">
      <Sidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} onRequestLogout={() => setConfirmLogoutOpen(true)} />
      {sidebarOpen ? (
        <button aria-label="Close navigation" className="sidebar-scrim" onClick={() => setSidebarOpen(false)} type="button">
          <X size={22} aria-hidden="true" />
        </button>
      ) : null}
      <section className="content-shell">
        <Header onMenuClick={() => setSidebarOpen(true)} pageTitle={pageTitle} />
        <div className="content-body">{children}</div>
      </section>
      <ConfirmDialog
        confirmLabel="Logout"
        message={`End ${user.name}'s TransitOps session started for ${formatDate(user.createdAt)}?`}
        onCancel={() => setConfirmLogoutOpen(false)}
        onConfirm={handleLogout}
        open={confirmLogoutOpen}
        title="Confirm logout"
      />
    </main>
  );
}

function RoutedApp() {
  const { user } = useAuth();
  const { path } = useNavigation();

  if (path === "/login") {
    return <LoginPage />;
  }

  if (path === "/" && user) {
    return (
      <ProtectedRoute>
        <RouteRedirect to={getDefaultRouteForRole(user.role)} />
      </ProtectedRoute>
    );
  }

  const moduleName = routeModules[path];
  const pageTitle = navigationItems.find((item) => item.module === moduleName)?.label ?? "TransitOps";

  if (!moduleName) {
    return (
      <ProtectedRoute>
        <AppShell pageTitle="Not found">
          <NotFoundPage />
        </AppShell>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={MODULE_PERMISSIONS[moduleName]}>
      <AppShell pageTitle={pageTitle}>
        <ModuleView moduleName={moduleName} />
      </AppShell>
    </ProtectedRoute>
  );
}

function RouteRedirect({ to }) {
  const { navigate } = useNavigation();
  React.useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);

  return null;
}

export function App() {
  return (
    <NavigationProvider>
      <AuthProvider>
        <ToastProvider>
          <RoutedApp />
        </ToastProvider>
      </AuthProvider>
    </NavigationProvider>
  );
}
