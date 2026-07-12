import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ROLES,
  canAccessModule,
  canPerformAction,
  canShowNavigationItem,
  getDefaultRouteForRole
} from "../src/lib/permissions.js";

describe("frontend permissions", () => {
  it("allows Admin to access operational modules", () => {
    assert.equal(canAccessModule(ROLES.ADMIN, "vehicles"), true);
    assert.equal(canAccessModule(ROLES.ADMIN, "trips"), true);
    assert.equal(canAccessModule(ROLES.ADMIN, "analytics"), true);
  });

  it("keeps restricted roles out of unrelated modules", () => {
    assert.equal(canAccessModule(ROLES.DISPATCHER, "vehicles"), false);
    assert.equal(canAccessModule(ROLES.FINANCIAL_ANALYST, "dashboard"), true);
    assert.equal(canAccessModule(ROLES.FINANCIAL_ANALYST, "expenses"), true);
    assert.equal(canAccessModule(ROLES.SAFETY_OFFICER, "driverCompliance"), true);
  });

  it("centralizes navigation and action visibility", () => {
    const user = { role: ROLES.FLEET_MANAGER };
    assert.equal(canShowNavigationItem(user, { module: "maintenance" }), true);
    assert.equal(canShowNavigationItem(user, { module: "driverCompliance" }), true);
    assert.equal(canShowNavigationItem(user, { module: "trips" }), false);
    assert.equal(canPerformAction(user, [ROLES.ADMIN, ROLES.FLEET_MANAGER]), true);
  });

  it("routes each role to an allowed default page", () => {
    assert.equal(getDefaultRouteForRole(ROLES.DISPATCHER), "/trips");
    assert.equal(getDefaultRouteForRole(ROLES.SAFETY_OFFICER), "/drivers");
    assert.equal(getDefaultRouteForRole(ROLES.FINANCIAL_ANALYST), "/dashboard");
  });
});
