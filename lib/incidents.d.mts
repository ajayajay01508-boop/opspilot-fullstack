export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Status = "Investigating" | "Identified" | "Monitoring" | "Resolved";
export interface Incident {
  id: string;
  title: string;
  service: string;
  severity: Severity;
  status: Status;
  owner: string;
  age: string;
}
export function nextIncidentId(incidents: Array<Pick<Incident, "id">>): string;
export function createIncident(form: { title: FormDataEntryValue | null; service: FormDataEntryValue | null; severity: FormDataEntryValue | null }, incidents: Incident[], owner?: string): Incident;
export function resolveIncident(incident: Incident): Incident;
export function summarizeIncidents(incidents: Incident[]): { open: number; critical: number; resolved: number };
