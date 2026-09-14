import type { z } from 'zod';
import type {
  menuFiltersSchema,
  menuItemSchema,
  menuItemStatusSchema,
  shopSchema,
  statusKindSchema,
  stopItemPayloadSchema,
  stopReasonSchema,
} from './schema';

export type Shop = z.infer<typeof shopSchema>;
export type StopReason = z.infer<typeof stopReasonSchema>;
export type MenuItemStatusKind = z.infer<typeof statusKindSchema>;
export type MenuItemStatus = z.infer<typeof menuItemStatusSchema>;
export type MenuItem = z.infer<typeof menuItemSchema>;
export type StopItemPayload = z.infer<typeof stopItemPayloadSchema>;
export type MenuFilters = z.infer<typeof menuFiltersSchema>;
