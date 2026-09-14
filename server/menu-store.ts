import 'server-only';
import { UNTIL_STEP_MS } from '@/entities/menu/schema';
import type { MenuFilters, MenuItem, MenuItemStatus, StopItemPayload } from '@/entities/menu/types';

export type MenuStoreError = 'not_found' | 'not_stopped' | 'out_of_stock';

export type MenuStoreResult = { ok: true; item: MenuItem } | { ok: false; error: MenuStoreError };

type SeedItem = Pick<MenuItem, 'title' | 'shop' | 'stock'> & { status: MenuItemStatus };

function hoursFromNowOnStep(hours: number): string {
  const ts = Date.now() + hours * 60 * 60 * 1000;
  return new Date(Math.ceil(ts / UNTIL_STEP_MS) * UNTIL_STEP_MS).toISOString();
}

function createSeed(): Map<string, MenuItem> {
  const available: MenuItemStatus = { kind: 'available' };
  const seed: SeedItem[] = [
    { title: 'Борщ с говядиной', shop: 'kitchen', stock: 12, status: available },
    {
      title: 'Цезарь с курицей',
      shop: 'kitchen',
      stock: 0,
      status: { kind: 'stopped', reason: 'out_of_stock', until: null },
    },
    { title: 'Паста карбонара', shop: 'kitchen', stock: 8, status: available },
    {
      title: 'Стейк рибай',
      shop: 'kitchen',
      stock: 3,
      status: { kind: 'stopped', reason: 'equipment', until: hoursFromNowOnStep(2) },
    },
    { title: 'Том ям с креветками', shop: 'kitchen', stock: 15, status: available },
    { title: 'Бургер с беконом', shop: 'kitchen', stock: 9, status: available },
    { title: 'Капучино', shop: 'bar', stock: 40, status: available },
    {
      title: 'Лимонад манго-маракуйя',
      shop: 'bar',
      stock: 6,
      status: { kind: 'stopped', reason: 'menu_change', until: null },
    },
    { title: 'Мохито безалкогольный', shop: 'bar', stock: 20, status: available },
    {
      title: 'Апельсиновый фреш',
      shop: 'bar',
      stock: 0,
      status: { kind: 'stopped', reason: 'out_of_stock', until: null },
    },
    { title: 'Матча латте', shop: 'bar', stock: 25, status: available },
    { title: 'Чизкейк Нью-Йорк', shop: 'pastry', stock: 5, status: available },
    {
      title: 'Тирамису',
      shop: 'pastry',
      stock: 2,
      status: { kind: 'stopped', reason: 'quality', until: hoursFromNowOnStep(1) },
    },
    { title: 'Круассан с миндалём', shop: 'pastry', stock: 18, status: available },
    { title: 'Медовик', shop: 'pastry', stock: 7, status: available },
  ];

  const updatedAt = new Date().toISOString();
  return new Map(
    seed.map((item, index) => {
      const id = `item-${index + 1}`;
      return [id, { id, updatedAt, ...item }];
    }),
  );
}

const globalForStore = globalThis as typeof globalThis & { menuItems?: Map<string, MenuItem> };
const items = (globalForStore.menuItems ??= createSeed());

function readItem(id: string): MenuItem | undefined {
  const item = items.get(id);
  if (item?.status.kind !== 'stopped' || item.status.until === null) return item;
  if (Date.parse(item.status.until) > Date.now()) return item;

  const expired: MenuItem = {
    ...item,
    status: { kind: 'available' },
    updatedAt: item.status.until,
  };
  items.set(id, expired);
  return expired;
}

function writeItem(item: MenuItem, status: MenuItemStatus): MenuItem {
  const updated: MenuItem = { ...item, status, updatedAt: new Date().toISOString() };
  items.set(item.id, updated);
  return updated;
}

export function listMenuItems({ shop, status }: MenuFilters): MenuItem[] {
  return [...items.keys()]
    .map((id) => readItem(id))
    .filter((item): item is MenuItem => item !== undefined)
    .filter((item) => (!shop || item.shop === shop) && (!status || item.status.kind === status));
}

export function stopMenuItem(id: string, payload: StopItemPayload): MenuStoreResult {
  const item = readItem(id);
  if (!item) return { ok: false, error: 'not_found' };

  return { ok: true, item: writeItem(item, { kind: 'stopped', ...payload }) };
}

export function resumeMenuItem(id: string): MenuStoreResult {
  const item = readItem(id);
  if (!item) return { ok: false, error: 'not_found' };
  if (item.status.kind !== 'stopped') return { ok: false, error: 'not_stopped' };
  if (item.stock === 0) return { ok: false, error: 'out_of_stock' };

  return { ok: true, item: writeItem(item, { kind: 'available' }) };
}
