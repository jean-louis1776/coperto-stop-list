import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'motion/react';
import { memo, useId } from 'react';
import {
  formatStopUntil,
  SHOP_LABELS,
  STATUS_LABELS,
  STOP_REASON_LABELS,
} from '@/entities/menu/labels';
import type { MenuItem, MenuItemStatus } from '@/entities/menu/types';
import { useIsClient } from '@/shared/lib/use-is-client';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Spinner } from '@/shared/ui/Spinner';
import type { MenuItemAction } from '../model/queries';

const OUT_OF_STOCK_HINT = 'Нельзя вернуть в продажу: остаток 0';

interface MenuItemRowProps {
  item: MenuItem;
  pendingAction: MenuItemAction | null;
  onStop: (itemId: string) => void;
  onResume: (itemId: string) => void;
}

export const MenuItemRow = memo(function MenuItemRow({
  item,
  pendingAction,
  onStop,
  onResume,
}: MenuItemRowProps) {
  const hintId = useId();
  const isStopped = item.status.kind === 'stopped';
  const isOutOfStock = item.stock === 0;
  const isPending = pendingAction !== null;

  return (
    <tr
      className={clsx(
        'border-t border-line transition-colors duration-300',
        isStopped ? 'bg-canvas/70' : 'bg-surface',
      )}
    >
      <td className="truncate px-4 py-3" title={item.title}>
        <span
          className={clsx(
            'font-medium transition-colors duration-300',
            isStopped ? 'text-muted' : 'text-ink',
          )}
        >
          {item.title}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted">{SHOP_LABELS[item.shop]}</td>
      <td
        className={clsx(
          'px-4 py-3 text-sm tabular-nums',
          isOutOfStock ? 'font-medium text-danger' : 'text-ink',
        )}
      >
        {item.stock} шт.
      </td>
      <td className="px-4 py-3">
        <div className="relative flex items-center justify-between gap-3">
          <StatusBadge status={item.status} />
          <AnimatePresence>
            {isPending && (
              <motion.span
                role="status"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted"
              >
                <Spinner className="size-3" />
                сохраняется
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-end gap-2">
          {isStopped ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => onStop(item.id)}
              >
                Изменить
              </Button>
              <span title={isOutOfStock ? OUT_OF_STOCK_HINT : undefined}>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-40"
                  disabled={isOutOfStock || isPending}
                  loading={pendingAction === 'resume'}
                  loadingText="Возвращаем…"
                  aria-describedby={isOutOfStock ? hintId : undefined}
                  onClick={() => onResume(item.id)}
                >
                  Вернуть в продажу
                </Button>
              </span>
              {isOutOfStock && (
                <span id={hintId} className="sr-only">
                  {OUT_OF_STOCK_HINT}
                </span>
              )}
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="w-40"
              disabled={isPending}
              onClick={() => onStop(item.id)}
            >
              В стоп-лист
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
});

function StatusBadge({ status }: { status: MenuItemStatus }) {
  const isClient = useIsClient();
  const badgeKey = status.kind === 'stopped' ? `${status.reason}:${status.until}` : status.kind;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={badgeKey}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.18 }}
        className="inline-flex min-w-0"
      >
        {status.kind === 'stopped' ? (
          <Badge tone="accent">
            {STOP_REASON_LABELS[status.reason]} ·{' '}
            <time dateTime={status.until ?? undefined}>
              {status.until === null || isClient ? formatStopUntil(status.until) : ''}
            </time>
          </Badge>
        ) : (
          <Badge tone="success">{STATUS_LABELS.available}</Badge>
        )}
      </motion.span>
    </AnimatePresence>
  );
}
