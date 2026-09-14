import 'server-only';

export const LIST_DELAY_MS = 800;
export const LIST_FAILURE_RATE = 0.1;
export const MUTATION_DELAY_MS = 600;
export const MUTATION_FAILURE_RATE = 0.2;

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shouldFail(rate: number): boolean {
  return Math.random() < rate;
}
