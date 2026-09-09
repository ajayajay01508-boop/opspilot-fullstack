export function classifyRisk({ latencyMs, errorRate, queueDepth }) {
  if (![latencyMs, errorRate, queueDepth].every(Number.isFinite)) throw new TypeError("Telemetry values must be finite numbers.");
  if (latencyMs < 0 || errorRate < 0 || queueDepth < 0) throw new RangeError("Telemetry values cannot be negative.");
  if (latencyMs > 650 || errorRate > 8) return "critical";
  if (latencyMs > 350 || errorRate > 4 || queueDepth > 5000) return "high";
  if (latencyMs > 200 || errorRate > 2 || queueDepth > 2000) return "medium";
  return "normal";
}
