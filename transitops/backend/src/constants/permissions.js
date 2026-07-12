import { ROLES } from "./enums.js";

export const MODULE_PERMISSIONS = Object.freeze({
  vehicles: [ROLES.ADMIN, ROLES.FLEET_MANAGER],
  maintenance: [ROLES.ADMIN, ROLES.FLEET_MANAGER],
  dashboard: [ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST],
  reports: [ROLES.ADMIN, ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST],
  trips: [ROLES.ADMIN, ROLES.DISPATCHER],
  dispatch: [ROLES.ADMIN, ROLES.DISPATCHER],
  driverCompliance: [ROLES.ADMIN, ROLES.SAFETY_OFFICER],
  safety: [ROLES.ADMIN, ROLES.SAFETY_OFFICER],
  fuel: [ROLES.ADMIN, ROLES.FINANCIAL_ANALYST],
  expenses: [ROLES.ADMIN, ROLES.FINANCIAL_ANALYST],
  analytics: [ROLES.ADMIN, ROLES.FINANCIAL_ANALYST]
});

export function canAccessModule(role, moduleName) {
  return MODULE_PERMISSIONS[moduleName]?.includes(role) ?? false;
}
