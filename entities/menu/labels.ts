import type { MenuItemStatusKind, Shop, StopReason } from './types';

export const SHOP_LABELS: Record<Shop, string> = {
  kitchen: 'Кухня',
  bar: 'Бар',
  pastry: 'Кондитерская',
};

export const STATUS_LABELS: Record<MenuItemStatusKind, string> = {
  available: 'В продаже',
  stopped: 'В стоп-листе',
};

export const STOP_REASON_LABELS: Record<StopReason, string> = {
  out_of_stock: 'Закончились продукты',
  equipment: 'Сломалось оборудование',
  quality: 'Вопросы к качеству партии',
  menu_change: 'Выведена из меню смены',
};

const timeFormat = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
const dateTimeFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatStopUntil(until: string | null, now = new Date()): string {
  if (until === null) return 'до конца смены';

  const date = new Date(until);
  const isSameDay = date.toDateString() === now.toDateString();
  return `до ${(isSameDay ? timeFormat : dateTimeFormat).format(date)}`;
}
