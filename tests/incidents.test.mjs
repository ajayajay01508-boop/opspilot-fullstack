import test from "node:test";
import assert from "node:assert/strict";
import { createIncident, nextIncidentId, resolveIncident, summarizeIncidents } from "../lib/incidents.mjs";
import { classifyRisk } from "../lib/risk.mjs";

const incidents = [
  { id: "INC-4821", severity: "Critical", status: "Investigating", age: "18m" },
  { id: "INC-4819", severity: "High", status: "Resolved", age: "1h" },
];

test("generates an ID after the highest existing incident", () => {
  assert.equal(nextIncidentId(incidents), "INC-4822");
});

test("validates and creates a normalized incident", () => {
  const item = createIncident({ title: "  Elevated API latency  ", service: "Payments API", severity: "High" }, incidents);
  assert.deepEqual(item, { id: "INC-4822", title: "Elevated API latency", service: "Payments API", severity: "High", status: "Investigating", owner: "Ajay", age: "Now" });
});

test("rejects unsupported services and severities", () => {
  assert.throws(() => createIncident({ title: "Valid incident", service: "Unknown", severity: "High" }, incidents), /Unknown service/);
  assert.throws(() => createIncident({ title: "Valid incident", service: "Search", severity: "Urgent" }, incidents), /Unknown severity/);
});

test("resolves incidents without mutating the original", () => {
  const original = { ...incidents[0] };
  const resolved = resolveIncident(incidents[0]);
  assert.equal(resolved.status, "Resolved");
  assert.deepEqual(incidents[0], original);
});

test("summarizes operational incident counts", () => {
  assert.deepEqual(summarizeIncidents(incidents), { open: 1, critical: 1, resolved: 1 });
});

test("classifies telemetry at documented thresholds", () => {
  assert.equal(classifyRisk({ latencyMs: 100, errorRate: 1, queueDepth: 100 }), "normal");
  assert.equal(classifyRisk({ latencyMs: 250, errorRate: 1, queueDepth: 100 }), "medium");
  assert.equal(classifyRisk({ latencyMs: 400, errorRate: 1, queueDepth: 100 }), "high");
  assert.equal(classifyRisk({ latencyMs: 700, errorRate: 1, queueDepth: 100 }), "critical");
});

test("rejects malformed telemetry", () => {
  assert.throws(() => classifyRisk({ latencyMs: -1, errorRate: 1, queueDepth: 1 }), /cannot be negative/);
  assert.throws(() => classifyRisk({ latencyMs: Number.NaN, errorRate: 1, queueDepth: 1 }), /finite numbers/);
});
