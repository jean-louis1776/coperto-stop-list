import { z } from 'zod';

export const SHOPS = ['kitchen', 'bar', 'pastry'] as const;
export const STATUS_KINDS = ['available', 'stopped'] as const;
export const STOP_REASONS = ['out_of_stock', 'equipment', 'quality', 'menu_change'] as const;

const MAX_AHEAD_MS = 24 * 60 * 60 * 1000;
export const UNTIL_STEP_MS = 15 * 60 * 1000;

export function validateUntil(value: string | null, now = Date.now()): string | null {
  if (value === null) return null;

  const ts = Date.parse(value);
  if (Number.isNaN(ts)) return 'Некорректное время';
  if (ts <= now) return 'Время должно быть в будущем';
  if (ts - now > MAX_AHEAD_MS) return 'Не больше чем на 24 часа вперёд';
  if (ts % UNTIL_STEP_MS !== 0) return 'Шаг — 15 минут';

  return null;
}

export function getUntilSlotRange(now = Date.now()): { min: number; max: number } {
  return {
    min: Math.floor(now / UNTIL_STEP_MS) * UNTIL_STEP_MS + UNTIL_STEP_MS,
    max: Math.floor((now + MAX_AHEAD_MS) / UNTIL_STEP_MS) * UNTIL_STEP_MS,
  };
}

export const shopSchema = z.enum(SHOPS);
export const statusKindSchema = z.enum(STATUS_KINDS);
export const stopReasonSchema = z.enum(STOP_REASONS, { error: 'Выберите причину' });

const isoDateTimeSchema = z.iso.datetime({ offset: true, error: 'Укажите время' });

export const menuItemStatusSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('available') }),
  z.object({
    kind: z.literal('stopped'),
    reason: stopReasonSchema,
    until: isoDateTimeSchema.nullable(),
  }),
]);

export const menuItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  shop: shopSchema,
  stock: z.number().int().min(0).max(99),
  status: menuItemStatusSchema,
  updatedAt: isoDateTimeSchema,
});

export const menuItemListSchema = z.array(menuItemSchema);

export const stopItemPayloadSchema = z.object({
  reason: stopReasonSchema,
  until: isoDateTimeSchema.nullable().superRefine((value, ctx) => {
    const error = validateUntil(value);
    if (error) ctx.addIssue({ code: 'custom', message: error });
  }),
});

export const menuFiltersSchema = z.object({
  shop: shopSchema.optional().catch(undefined),
  status: statusKindSchema.optional().catch(undefined),
});
