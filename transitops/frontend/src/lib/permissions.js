export const ROLES = Object.freeze({
  ADMIN: "Admin",
  FLEET_MANAGER: "Fleet Manager",
  DISPATCHER: "Dispatcher",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst"
});

export const DEFAULT_ROUTE_BY_ROLE = Object.freeze({
  [ROLES.ADMIN]: "/dashboard",
  [ROLES.FLEET_MANAGER]: "/dashboard",
  [ROLES.DISPATCHER]: "/trips",
  [ROLES.SAFETY_OFFICER]: "/drivers",
  [ROLES.FINANCIAL_ANALYST]: "/dashboard"
});

export const MODULE_PERMISSIONS = Object.freeze({
  dashboard: [ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST],
  vehicles: [ROLES.ADMIN, ROLES.FLEET_MANAGER],
  maintenance: [ROLES.ADMIN, ROLES.FLEET_MANAGER],
  trips: [ROLES.ADMIN, ROLES.DISPATCHER],
  dispatch: [ROLES.ADMIN, ROLES.DISPATCHER],
  driverCompliance: [ROLES.ADMIN, ROLES.SAFETY_OFFICER],
  reports: [ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST],
  fuel: [ROLES.ADMIN, ROLES.FINANCIAL_ANALYST],
  expenses: [ROLES.ADMIN, ROLES.FINANCIAL_ANALYST],
  analytics: [ROLES.ADMIN, ROLES.FINANCIAL_ANALYST]
});

export function canAccessModule(role, moduleName) {
  return MODULE_PERMISSIONS[moduleName]?.includes(role) ?? false;
}

export function canShowNavigationItem(user, item) {
  return Boolean(user?.role) && canAccessModule(user.role, item.module);
}

export function canPerformAction(user, allowedRoles = []) {
  if (!user?.role) {
    return false;
  }

  return allowedRoles.includes(user.role);
}

export function getDefaultRouteForRole(role) {
  return DEFAULT_ROUTE_BY_ROLE[role] ?? "/dashboard";
}
