import { memo } from 'react';
import type { MenuItem } from '@/entities/menu/types';
import type { MenuItemAction } from '../model/queries';
import { MenuItemRow } from './MenuItemRow';

interface StopListTableProps {
  items: MenuItem[];
  pendingStopIds: ReadonlySet<string>;
  pendingResumeIds: ReadonlySet<string>;
  onStop: (itemId: string) => void;
  onResume: (itemId: string) => void;
}

function getPendingAction(
  itemId: string,
  pendingStopIds: ReadonlySet<string>,
  pendingResumeIds: ReadonlySet<string>,
): MenuItemAction | null {
  if (pendingResumeIds.has(itemId)) return 'resume';
  if (pendingStopIds.has(itemId)) return 'stop';
  return null;
}

export const StopListTable = memo(function StopListTable({
  items,
  pendingStopIds,
  pendingResumeIds,
  onStop,
  onResume,
}: StopListTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
      <table className="w-full min-w-[1200px] table-fixed text-left">
        <colgroup>
          <col />
          <col className="w-36" />
          <col className="w-24" />
          <col className="w-100" />
          <col className="w-72" />
        </colgroup>
        <thead className="bg-canvas/50 text-xs font-medium tracking-wide text-muted uppercase">
          <tr>
            <th scope="col" className="px-4 py-3">
              Позиция
            </th>
            <th scope="col" className="px-4 py-3">
              Цех
            </th>
            <th scope="col" className="px-4 py-3">
              Остаток
            </th>
            <th scope="col" className="px-4 py-3">
              Статус
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Действия</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              pendingAction={getPendingAction(item.id, pendingStopIds, pendingResumeIds)}
              onStop={onStop}
              onResume={onResume}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
});
