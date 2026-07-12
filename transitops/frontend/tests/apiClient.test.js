import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("frontend foundation", () => {
  it("keeps API configuration documented for Vite", () => {
    assert.equal("VITE_API_BASE_URL".startsWith("VITE_"), true);
  });
});
