import { memo } from 'react';
import { SHOP_LABELS, STATUS_LABELS } from '@/entities/menu/labels';
import { SHOPS, shopSchema, STATUS_KINDS, statusKindSchema } from '@/entities/menu/schema';
import type { MenuFilters, MenuItemStatusKind, Shop } from '@/entities/menu/types';
import { Field } from '@/shared/ui/Field';
import { Select } from '@/shared/ui/Select';

const SHOP_OPTIONS = SHOPS.map((shop) => ({ value: shop, label: SHOP_LABELS[shop] }));
const STATUS_OPTIONS = STATUS_KINDS.map((kind) => ({ value: kind, label: STATUS_LABELS[kind] }));

interface FiltersProps {
  shop?: Shop;
  status?: MenuItemStatusKind;
  onChange: (patch: MenuFilters) => void;
}

export const Filters = memo(function Filters({ shop, status, onChange }: FiltersProps) {
  return (
    <div role="group" aria-label="Фильтры" className="flex flex-wrap gap-3">
      <Field label="Цех">
        {(fieldProps) => (
          <Select
            {...fieldProps}
            className="w-52"
            value={shop ?? ''}
            options={SHOP_OPTIONS}
            placeholder="Все цеха"
            onChange={(event) => onChange({ shop: shopSchema.safeParse(event.target.value).data })}
          />
        )}
      </Field>
      <Field label="Статус">
        {(fieldProps) => (
          <Select
            {...fieldProps}
            className="w-52"
            value={status ?? ''}
            options={STATUS_OPTIONS}
            placeholder="Все статусы"
            onChange={(event) =>
              onChange({ status: statusKindSchema.safeParse(event.target.value).data })
            }
          />
        )}
      </Field>
    </div>
  );
});
