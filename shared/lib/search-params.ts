export function toSearchString(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string] => entry[1] !== undefined,
  );
  const search = new URLSearchParams(entries).toString();
  return search ? `?${search}` : '';
}
