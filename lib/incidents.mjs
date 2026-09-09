export const SERVICES = ["Payments API", "Checkout", "Messaging", "Search"];
export const SEVERITIES = ["Critical", "High", "Medium", "Low"];

export function nextIncidentId(incidents) {
  const highest = incidents.reduce((max, incident) => {
    const match = /^INC-(\d+)$/.exec(incident.id);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 4800);
  return `INC-${highest + 1}`;
}

export function createIncident(form, incidents, owner = "Ajay") {
  const title = String(form.title ?? "").trim();
  const service = String(form.service ?? "");
  const severity = String(form.severity ?? "");
  if (title.length < 5 || title.length > 100) throw new Error("Incident title must be 5–100 characters.");
  if (!SERVICES.includes(service)) throw new Error("Unknown service.");
  if (!SEVERITIES.includes(severity)) throw new Error("Unknown severity.");
  return { id: nextIncidentId(incidents), title, service, severity, status: "Investigating", owner, age: "Now" };
}

export function resolveIncident(incident) {
  if (!incident) throw new Error("Incident not found.");
  return { ...incident, status: "Resolved", age: incident.age === "Now" ? "1m" : incident.age };
}

export function summarizeIncidents(incidents) {
  return {
    open: incidents.filter((incident) => incident.status !== "Resolved").length,
    critical: incidents.filter((incident) => incident.status !== "Resolved" && incident.severity === "Critical").length,
    resolved: incidents.filter((incident) => incident.status === "Resolved").length,
  };
}
