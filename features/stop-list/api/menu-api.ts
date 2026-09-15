import { menuItemListSchema, menuItemSchema } from '@/entities/menu/schema';
import type { MenuFilters, StopItemPayload } from '@/entities/menu/types';
import { request } from '@/shared/api/http';
import { toSearchString } from '@/shared/lib/search-params';

const MENU_ITEMS_URL = '/api/menu-items';

export function fetchMenuItems(filters: MenuFilters, signal?: AbortSignal) {
  return request(`${MENU_ITEMS_URL}${toSearchString(filters)}`, menuItemListSchema, { signal });
}

export function stopMenuItem(id: string, payload: StopItemPayload) {
  return request(`${MENU_ITEMS_URL}/${encodeURIComponent(id)}/stop`, menuItemSchema, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function resumeMenuItem(id: string) {
  return request(`${MENU_ITEMS_URL}/${encodeURIComponent(id)}/resume`, menuItemSchema, {
    method: 'POST',
  });
}
