export const focusRing =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export const controlBase =
  'h-10 rounded-lg border bg-surface px-3 text-sm text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export const controlBorder = (invalid?: boolean) =>
  invalid ? 'border-danger focus-visible:outline-danger' : 'border-line hover:border-muted/60';
