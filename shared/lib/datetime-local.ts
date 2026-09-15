const MINUTE_MS = 60_000;

export function isoToDateTimeLocal(iso: string): string {
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return '';

  const offsetMs = new Date(ts).getTimezoneOffset() * MINUTE_MS;
  return new Date(ts - offsetMs).toISOString().slice(0, 16);
}

export function dateTimeLocalToIso(value: string): string {
  const ts = new Date(value).getTime();
  return Number.isNaN(ts) ? '' : new Date(ts).toISOString();
}
