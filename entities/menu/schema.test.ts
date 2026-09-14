import { describe, expect, it } from 'vitest';
import { stopItemPayloadSchema, validateUntil } from './schema';

const NOW = Date.parse('2026-09-14T12:00:00.000Z');

describe('validateUntil', () => {
  it.each([
    [null, null],
    ['not a date', 'Некорректное время'],
    ['2026-09-14T12:00:00.000Z', 'Время должно быть в будущем'],
    ['2026-09-14T11:45:00.000Z', 'Время должно быть в будущем'],
    ['2026-09-14T12:10:00.000Z', 'Шаг — 15 минут'],
    ['2026-09-15T12:15:00.000Z', 'Не больше чем на 24 часа вперёд'],
    ['2026-09-14T12:15:00.000Z', null],
    ['2026-09-15T12:00:00.000Z', null],
  ])('%s → %s', (value, expected) => {
    expect(validateUntil(value, NOW)).toBe(expected);
  });
});

describe('stopItemPayloadSchema', () => {
  it('rejects an empty reason', () => {
    const result = stopItemPayloadSchema.safeParse({ reason: '', until: null });
    expect(result.success).toBe(false);
  });

  it('accepts "until end of shift"', () => {
    const result = stopItemPayloadSchema.safeParse({ reason: 'equipment', until: null });
    expect(result.success).toBe(true);
  });
});
