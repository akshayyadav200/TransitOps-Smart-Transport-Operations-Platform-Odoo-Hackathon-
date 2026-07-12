export const ROLES = Object.freeze({
  ADMIN: "Admin",
  FLEET_MANAGER: "Fleet Manager",
  DISPATCHER: "Dispatcher",
  SAFETY_OFFICER: "Safety Officer",
  FINANCIAL_ANALYST: "Financial Analyst"
});

export const MODULE_PERMISSIONS = Object.freeze({
  dashboard: [ROLES.ADMIN, ROLES.FLEET_MANAGER],
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
